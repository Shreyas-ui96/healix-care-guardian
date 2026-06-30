"""
01_preprocess_ddxplus.py — Clean and preprocess the DDXPlus dataset.

Source: DDXPlus (Mila/Université de Montréal), English version.
  Paper:  https://arxiv.org/abs/2205.09148
  Data:   https://figshare.com/articles/dataset/DDXPlus_Dataset_English_/22687585
  Repo:   https://github.com/mila-iqia/ddxplus

Why DDXPlus over the earlier Kaggle "Disease Symptom Prediction" dataset:
That dataset had ZERO symptom overlap between any two diseases (verified during
the earlier project) -- every symptom combo mapped to exactly one disease, making
it trivially memorizable rather than a genuine diagnostic problem. DDXPlus is
built from a real clinical knowledge base reviewed by doctors, and 84% of disease
pairs here (990/1176) share at least one symptom, with some pairs (e.g.
Influenza/Pneumonia) sharing 21 -- this is what real differential diagnosis looks
like, and models trained on it have to actually learn to discriminate, not memorize.

Files used (must be placed in data/):
  - release_conditions.json   (49 diseases: names, symptom/antecedent lists, severity 1-5)
  - release_evidences.json    (223 evidence definitions: binary/categorical/multi-choice)
  - release_train_patients.csv (1,025,602 synthetic patient records)

Simplification made here: DDXPlus evidences can be binary (B), categorical (C,
e.g. "pain intensity 0-4"), or multi-choice (M, e.g. "where does it radiate").
For a chatbot-friendly symptom checker, we collapse all evidence types to BINARY
presence/absence ("did the patient report this evidence at all?") rather than
modeling exact categorical values -- this matches how a real user would describe
symptoms in conversation ("I have a rash" rather than "my rash is intensity 3 on
a 0-4 scale"). This does discard some information the original dataset offers;
see README.md for how to extend this if you want categorical detail later.

Run:
    python 01_preprocess_ddxplus.py
"""
import ast
import json
import os
import re

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs")

CONDITIONS_PATH = os.path.join(DATA_DIR, "release_conditions.json")
EVIDENCES_PATH = os.path.join(DATA_DIR, "release_evidences.json")
PATIENTS_PATH = os.path.join(DATA_DIR, "release_train_patients.csv")

# How many patient rows to sample PER DISEASE for training. DDXPlus has 1M+ rows;
# we don't need anywhere near that many for a solid model, and a balanced sample
# trains much faster while avoiding the class-imbalance skew in the raw data
# (URTI has 64k rows, Bronchiolitis has 261).
MAX_ROWS_PER_DISEASE = 1500
RANDOM_STATE = 42


def load_evidence_vocab() -> dict:
    """
    Build a symptom vocabulary from release_evidences.json.
    Returns {evidence_code: {"key": short_snake_case_key, "question": full_question_text}}.

    Two representations are kept deliberately:
    - "key": a short, stable column/identifier name (used as the ML feature column
      and as a compact API symptom key)
    - "question": the FULL original clinical question text (used for chatbot
      display -- DDXPlus questions are often detailed clinical phrasing, e.g.
      "Have you noticed light red blood or blood clots in your stool?", which
      loses important meaning if truncated into a short key. Always show
      `question` to end users; use `key` only as an internal identifier.
    """
    with open(EVIDENCES_PATH) as f:
        evidences = json.load(f)

    def _to_short_key(question: str, code: str) -> str:
        q = question.lower()
        q = re.sub(r"^(do you have|are you currently|are you|have you noticed|have you|did you|how|what|is your|is the|do you)\s*", "", q)
        q = re.sub(r"\(.*?\)", "", q)          # drop parenthetical clarifications
        q = re.sub(r"[?.,]", "", q)
        q = re.sub(r"\s+", "_", q.strip())
        q = re.sub(r"[^a-z0-9_]", "", q)
        # keep it short but end on a whole word, not a mid-word cut
        words = [w for w in q.split("_") if w]
        short = []
        length = 0
        for w in words:
            if length + len(w) + 1 > 45 and short:
                break
            short.append(w)
            length += len(w) + 1
        key = "_".join(short).strip("_")
        return key if key else code.lower()

    vocab = {}
    for code, ev in evidences.items():
        vocab[code] = {
            "key": _to_short_key(ev["question_en"], code),
            "question": ev["question_en"],
            "is_antecedent": ev["is_antecedent"],
        }

    # Defensive: shortened keys could collide across different evidence codes
    # (different questions truncating to the same short phrase). Disambiguate
    # by appending the evidence code suffix if needed.
    seen = {}
    for code, entry in vocab.items():
        key = entry["key"]
        if key in seen:
            entry["key"] = f"{key}_{code.lower()}"
        else:
            seen[key] = code

    return vocab


def load_conditions():
    with open(CONDITIONS_PATH) as f:
        return json.load(f)


def parse_evidence_list(raw_evidence_str: str) -> set:
    """
    Parse the EVIDENCES column, e.g. "['E_48', 'E_54_@_V_161', 'E_56_@_4']"
    into a set of base evidence codes: {'E_48', 'E_54', 'E_56'}.
    The '@' suffix encodes a categorical/multi-choice VALUE -- per the
    simplification noted in the module docstring, we only keep "was this
    evidence reported at all" (binary presence), dropping the specific value.
    """
    items = ast.literal_eval(raw_evidence_str)
    base_codes = set()
    for item in items:
        base_code = item.split("_@_")[0]
        base_codes.add(base_code)
    return base_codes


def sample_balanced_patients(max_per_disease: int = MAX_ROWS_PER_DISEASE) -> pd.DataFrame:
    """
    Stream the large patient CSV and sample up to `max_per_disease` rows per
    pathology, instead of loading 1M+ rows into memory at once.
    """
    print(f"Reading patient data in chunks, sampling up to {max_per_disease}/disease...")
    chunks = []
    counts = {}
    chunk_iter = pd.read_csv(PATIENTS_PATH, usecols=["AGE", "SEX", "PATHOLOGY", "EVIDENCES"], chunksize=50_000)

    for chunk in chunk_iter:
        for disease, group in chunk.groupby("PATHOLOGY"):
            have = counts.get(disease, 0)
            need = max_per_disease - have
            if need <= 0:
                continue
            take = group.head(need)
            chunks.append(take)
            counts[disease] = have + len(take)
        if all(c >= max_per_disease for c in counts.values()) and len(counts) >= 49:
            break

    result = pd.concat(chunks, ignore_index=True)
    print(f"Sampled {len(result)} rows across {result['PATHOLOGY'].nunique()} diseases")
    return result


def build_multihot(df: pd.DataFrame, evidence_vocab: dict) -> tuple[pd.DataFrame, pd.Series]:
    """Convert sampled patient rows (with raw EVIDENCES strings) into a binary
    multi-hot symptom matrix using short machine-readable column names (the
    `key` field of each vocab entry)."""
    print("Parsing evidence codes and building multi-hot matrix...")
    all_codes = sorted(evidence_vocab.keys())
    code_to_col = {c: evidence_vocab[c]["key"] for c in all_codes}

    feature_rows = []
    for raw in df["EVIDENCES"]:
        present_codes = parse_evidence_list(raw)
        row = {code_to_col[c]: 1 for c in present_codes if c in code_to_col}
        feature_rows.append(row)

    X = pd.DataFrame(feature_rows, columns=[code_to_col[c] for c in all_codes]).fillna(0).astype(np.int8)
    y = df["PATHOLOGY"].reset_index(drop=True)
    return X, y


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    print("Loading evidence vocabulary and condition metadata...")
    evidence_vocab = load_evidence_vocab()
    conditions = load_conditions()
    print(f"  {len(evidence_vocab)} evidence codes, {len(conditions)} diseases")

    # Save the vocabulary + condition metadata for later use (inference, severity lookup)
    with open(os.path.join(OUT_DIR, "evidence_vocab.json"), "w") as f:
        json.dump(evidence_vocab, f, indent=2)

    condition_meta = {
        name: {"severity": c.get("severity"), "icd10": c.get("icd10-id")}
        for name, c in conditions.items()
    }
    with open(os.path.join(OUT_DIR, "condition_meta.json"), "w") as f:
        json.dump(condition_meta, f, indent=2)

    sampled = sample_balanced_patients()

    print("\nClass distribution after sampling (min/max):")
    counts = sampled["PATHOLOGY"].value_counts()
    print(f"  min={counts.min()} ({counts.idxmin()}), max={counts.max()} ({counts.idxmax()})")

    X, y = build_multihot(sampled, evidence_vocab)
    print(f"\nFeature matrix shape: {X.shape}")

    # Drop fully-empty rows (defensive) and any all-zero feature columns (unused evidences)
    nonzero_cols = X.columns[X.sum(axis=0) > 0]
    dropped = X.shape[1] - len(nonzero_cols)
    if dropped:
        print(f"Dropping {dropped} all-zero evidence columns (not present in sampled rows)")
    X = X[nonzero_cols]

    # De-duplicate (symptom-set, disease) rows BEFORE splitting. DDXPlus's synthetic
    # patient generator samples repeatedly from the same per-disease symptom
    # probability templates, producing many verbatim-identical feature rows --
    # without deduping first, ~34% of a naive test split ends up being an exact
    # duplicate of a training row, which silently inflates every model's accuracy.
    print("\nDe-duplicating identical (symptom-set, disease) rows to prevent train/test leakage...")
    combined = X.copy()
    combined["__label__"] = y.values
    before = len(combined)
    combined = combined.drop_duplicates().reset_index(drop=True)
    after = len(combined)
    print(f"  {before} -> {after} unique rows ({before - after} duplicates removed)")
    y = combined["__label__"]
    X = combined.drop(columns="__label__")

    print("\nEncoding target labels...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    print(f"Classes: {len(le.classes_)}")

    print("\nSplitting train/test (80/20, stratified)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=RANDOM_STATE, stratify=y_encoded
    )
    print(f"Train: {X_train.shape}, Test: {X_test.shape}")

    X_train.to_csv(os.path.join(OUT_DIR, "X_train.csv"), index=False)
    X_test.to_csv(os.path.join(OUT_DIR, "X_test.csv"), index=False)
    pd.Series(y_train, name="label").to_csv(os.path.join(OUT_DIR, "y_train.csv"), index=False)
    pd.Series(y_test, name="label").to_csv(os.path.join(OUT_DIR, "y_test.csv"), index=False)
    pd.Series(le.classes_, name="disease").to_csv(os.path.join(OUT_DIR, "label_classes.csv"), index=False)

    print(f"\nSaved cleaned train/test splits to: {OUT_DIR}")


if __name__ == "__main__":
    main()
