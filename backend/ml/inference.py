"""
inference.py — Production inference wrapper with a PARTIAL-INPUT SAFETY NET.

This is the second half of "no gaps": even with much better data (DDXPlus,
realistic overlapping symptoms), a model trained on full-ish symptom profiles
will still be under-confident or wrong on very sparse input (1-3 symptoms),
because that's genuinely insufficient clinical information -- no model, however
good, should be confident about a diagnosis from "I have a headache." The fix
isn't a smarter model; it's making the SYSTEM behave honestly about uncertainty:

1. Confidence tiers: predictions are bucketed into high/medium/low confidence,
   not just a raw float -- easier for a chatbot to act on (e.g. only state a
   probable diagnosis at "high", otherwise keep asking questions).
2. Follow-up question suggestion: when confidence is low, the system identifies
   a symptom strongly associated with the current top candidate disease(s) that
   the user hasn't reported yet, and returns it as a suggested next question --
   this is what lets a chatbot interactively narrow a diagnosis down instead of
   guessing from too little information.
3. Minimum evidence count gate: below a configurable threshold of reported
   symptoms, the system explicitly declines to name a top diagnosis at all and
   instead returns tentative candidates + the next question to ask.
"""
import json
import os
from typing import List, Optional

import joblib
import pandas as pd

_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(_THIS_DIR, "models", "disease_classifier.joblib")
SYMPTOM_COLUMNS_PATH = os.path.join(_THIS_DIR, "models", "symptom_columns.json")
DISEASE_CLASSES_PATH = os.path.join(_THIS_DIR, "models", "disease_classes.json")
EVIDENCE_VOCAB_PATH = os.path.join(_THIS_DIR, "models", "evidence_vocab.json")
CONDITION_META_PATH = os.path.join(_THIS_DIR, "models", "condition_meta.json")
METRICS_PATH = os.path.join(_THIS_DIR, "models", "metrics.json")

MIN_EVIDENCE_COUNT = 3
HIGH_CONFIDENCE_THRESHOLD = 0.6
MEDIUM_CONFIDENCE_THRESHOLD = 0.3


class DiseasePredictor:
    def __init__(self):
        self.model = joblib.load(MODEL_PATH)
        with open(SYMPTOM_COLUMNS_PATH) as f:
            self.symptom_columns: List[str] = json.load(f)
        with open(DISEASE_CLASSES_PATH) as f:
            self.disease_classes: List[str] = json.load(f)
        with open(EVIDENCE_VOCAB_PATH) as f:
            self.evidence_vocab: dict = json.load(f)
        with open(CONDITION_META_PATH) as f:
            self.condition_meta: dict = json.load(f)
        with open(METRICS_PATH) as f:
            self.metrics = json.load(f)

        self._symptom_set = set(self.symptom_columns)
        self._key_to_question = {v["key"]: v["question"] for v in self.evidence_vocab.values()}
        self._disease_top_symptoms = self._compute_disease_symptom_affinity()

    def _compute_disease_symptom_affinity(self, top_n: int = 15) -> dict:
        """
        For each disease, identify which symptom keys are most associated with
        it based on the original DDXPlus conditions metadata (release_conditions.json),
        translated through the evidence vocabulary. This is more reliable than
        sensitivity from a zero-baseline for follow-up question generation,
        since the conditions metadata directly encodes which evidences are
        expected for each pathology.
        """
        # Load the raw conditions file to get per-disease evidence codes
        # Fall back to feature-importance proxy if file not available
        conditions_path = os.path.join(_THIS_DIR, "data", "release_conditions.json")
        if not os.path.exists(conditions_path):
            # Fallback: use global feature importance (not per-disease, but functional)
            importances = pd.Series(self.model.feature_importances_, index=self.symptom_columns)
            top_global = importances.sort_values(ascending=False).head(top_n).index.tolist()
            return {disease: top_global for disease in self.disease_classes}

        with open(conditions_path) as f:
            conditions = json.load(f)

        # Build evidence code -> key mapping
        code_to_key = {code: v["key"] for code, v in self.evidence_vocab.items()}

        affinity = {}
        for disease_name in self.disease_classes:
            if disease_name in conditions:
                cond = conditions[disease_name]
                # Combine symptom and antecedent codes, filter to ones we have as features
                all_evidence_codes = list(cond.get("symptoms", {}).keys()) + \
                                     list(cond.get("antecedents", {}).keys())
                sym_keys = [code_to_key[c] for c in all_evidence_codes
                           if c in code_to_key and code_to_key[c] in self._symptom_set]
                # Prioritize by global feature importance as a tiebreaker
                importances = pd.Series(self.model.feature_importances_, index=self.symptom_columns)
                sym_keys_sorted = sorted(sym_keys, key=lambda k: -importances.get(k, 0))
                affinity[disease_name] = sym_keys_sorted[:top_n]
            else:
                affinity[disease_name] = []

        return affinity

    def known_symptoms(self) -> List[dict]:
        seen = set()
        out = []
        for v in self.evidence_vocab.values():
            if v["key"] not in seen:
                out.append({"key": v["key"], "question": v["question"], "is_antecedent": v["is_antecedent"]})
                seen.add(v["key"])
        return out

    def known_diseases(self) -> List[str]:
        return list(self.disease_classes)

    def disease_severity(self, disease_name: str) -> Optional[int]:
        meta = self.condition_meta.get(disease_name)
        return meta["severity"] if meta else None

    def _confidence_tier(self, score: float) -> str:
        if score >= HIGH_CONFIDENCE_THRESHOLD:
            return "high"
        if score >= MEDIUM_CONFIDENCE_THRESHOLD:
            return "medium"
        return "low"

    def _suggest_follow_up_question(self, recognized: List[str], top_diseases: List[str], exclude_symptoms: Optional[List[str]] = None) -> Optional[dict]:
        already_asked = set(recognized)
        if exclude_symptoms:
            already_asked.update(exclude_symptoms)
        for disease in top_diseases:
            for sym_key in self._disease_top_symptoms.get(disease, []):
                if sym_key not in already_asked:
                    return {
                        "symptom_key": sym_key,
                        "question": self._key_to_question.get(sym_key, sym_key),
                        "asked_to_help_distinguish": disease,
                    }
        return None

    def validate_symptoms(self, symptoms: List[str]):
        recognized = [s for s in symptoms if s in self._symptom_set]
        unrecognized = [s for s in symptoms if s not in self._symptom_set]
        return recognized, unrecognized

    def predict(self, symptoms: List[str], top_k: int = 3, exclude_symptoms: Optional[List[str]] = None) -> dict:
        """
        Predict the top-k most likely diseases given a list of symptom keys.

        SAFETY NET BEHAVIOR:
        - Fewer than MIN_EVIDENCE_COUNT recognized symptoms -> `diagnosis_available=False`,
          a `follow_up_question` is returned instead of a confident top guess.
        - Every prediction includes `confidence_tier` (high/medium/low) so the
          calling chatbot can branch cleanly instead of parsing raw floats.
        - Medium/low confidence -> `follow_up_question` is still populated so
          the chatbot can ask one more question before committing to an answer.
        """
        recognized, unrecognized = self.validate_symptoms(symptoms)

        if not recognized:
            return {
                "diagnosis_available": False,
                "predictions": [],
                "recognized_symptoms": [],
                "unrecognized_symptoms": unrecognized,
                "follow_up_question": {
                    "symptom_key": "a_fever",
                    "question": self._key_to_question.get("a_fever", "Do you have a fever?"),
                    "asked_to_help_distinguish": None,
                },
                "warning": "No recognized symptoms provided.",
            }

        row = pd.DataFrame(
            [[1 if c in recognized else 0 for c in self.symptom_columns]],
            columns=self.symptom_columns,
        )
        proba = self.model.predict_proba(row)[0]
        ranked_idx = proba.argsort()[::-1][:top_k]

        predictions = []
        for i in ranked_idx:
            disease_name = self.disease_classes[self.model.classes_[i]]
            score = float(proba[i])
            predictions.append({
                "disease": disease_name,
                "confidence": round(score, 4),
                "confidence_tier": self._confidence_tier(score),
                "severity": self.disease_severity(disease_name),
            })

        top_tier = predictions[0]["confidence_tier"] if predictions else "low"
        top_diseases = [p["disease"] for p in predictions]

        diagnosis_available = len(recognized) >= MIN_EVIDENCE_COUNT and top_tier != "low"

        follow_up = None
        if not diagnosis_available or top_tier != "high":
            follow_up = self._suggest_follow_up_question(recognized, top_diseases, exclude_symptoms)

        warning = None
        if len(recognized) < MIN_EVIDENCE_COUNT:
            warning = (
                f"Only {len(recognized)} symptom(s) provided (minimum {MIN_EVIDENCE_COUNT} recommended). "
                "Predictions below are tentative -- ask the suggested follow-up question before presenting a result."
            )
        elif top_tier == "low":
            warning = "Low confidence: reported symptoms don't strongly match a known pattern. Consider asking more questions."
        elif top_tier == "medium":
            warning = "Medium confidence: a follow-up question could help confirm the leading candidate."

        return {
            "diagnosis_available": diagnosis_available,
            "predictions": predictions,
            "recognized_symptoms": recognized,
            "unrecognized_symptoms": unrecognized,
            "follow_up_question": follow_up,
            "warning": warning,
        }


predictor = DiseasePredictor()


if __name__ == "__main__":
    print("=== Sparse input (2 symptoms) -- should NOT claim a diagnosis ===")
    print(predictor.predict(["a_fever", "a_cough"]))
    print()
    print("=== Fuller input (6 symptoms) -- should be more confident ===")
    print(predictor.predict(["a_fever", "a_cough", "shortness_of_breath", "fatigue", "chest_pain", "chills"]))
