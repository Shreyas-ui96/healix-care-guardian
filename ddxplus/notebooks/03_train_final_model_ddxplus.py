"""
03_train_final_model_ddxplus.py — Train the selected model (Random Forest) on
the full cleaned DDXPlus dataset and save deployment-ready artifacts.

Model selection rationale (see outputs/model_comparison.csv):
Logistic Regression and Bernoulli Naive Bayes scored marginally higher on raw
F1 (97-98% vs RF's 89%), but a confidence-calibration stress test (sparse,
realistic 2-symptom input: "fever + cough") showed Naive Bayes returns 98.6%
confidence in its top guess from almost no information -- dangerously
overconfident for a chatbot to present as reliable. Random Forest gave the same
top answer with a much more honest 21.8% confidence. Since this system will
face realistic PARTIAL symptom input (not full textbook presentations), well-
calibrated uncertainty matters more than topping the leaderboard by 1-2 points.
Random Forest is selected as the production model for this reason.

Run:
    python 03_train_final_model_ddxplus.py
"""
import json
import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
    top_k_accuracy_score,
)

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models")


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    X_train = pd.read_csv(os.path.join(OUT_DIR, "X_train.csv"))
    X_test = pd.read_csv(os.path.join(OUT_DIR, "X_test.csv"))
    y_train = pd.read_csv(os.path.join(OUT_DIR, "y_train.csv"))["label"].values
    y_test = pd.read_csv(os.path.join(OUT_DIR, "y_test.csv"))["label"].values
    classes = pd.read_csv(os.path.join(OUT_DIR, "label_classes.csv"))["disease"].values
    symptom_columns = list(X_train.columns)

    with open(os.path.join(OUT_DIR, "evidence_vocab.json")) as f:
        evidence_vocab = json.load(f)
    with open(os.path.join(OUT_DIR, "condition_meta.json")) as f:
        condition_meta = json.load(f)

    print(f"Training Random Forest on {X_train.shape[0]} samples, {X_train.shape[1]} symptom features, {len(classes)} disease classes...")

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=20,
        min_samples_split=4,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    proba = model.predict_proba(X_test)

    acc = accuracy_score(y_test, preds)
    f1_macro = f1_score(y_test, preds, average="macro")
    precision_macro = precision_score(y_test, preds, average="macro", zero_division=0)
    recall_macro = recall_score(y_test, preds, average="macro", zero_division=0)
    top3_acc = top_k_accuracy_score(y_test, proba, k=3, labels=model.classes_)

    print(f"\nTest Accuracy:         {acc:.4f}")
    print(f"Test Top-3 Accuracy:   {top3_acc:.4f}  (true disease appears in top 3 guesses)")
    print(f"Test F1 (macro):       {f1_macro:.4f}")
    print(f"Test Precision (macro):{precision_macro:.4f}")
    print(f"Test Recall (macro):   {recall_macro:.4f}")
    print("\n(R^2 not reported -- classification task, not regression; see README.md)")

    print("\nFull classification report:")
    print(classification_report(y_test, preds, target_names=classes, zero_division=0))

    importances = pd.Series(model.feature_importances_, index=symptom_columns).sort_values(ascending=False)
    print("\nTop 15 most informative symptoms (by Random Forest importance):")
    for key, importance in importances.head(15).items():
        question = next((v["question"] for v in evidence_vocab.values() if v["key"] == key), key)
        print(f"  {importance:.4f}  {key:35s} | {question[:60]}")

    # --- Save deployment artifacts ---
    joblib.dump(model, os.path.join(MODEL_DIR, "disease_classifier.joblib"))

    with open(os.path.join(MODEL_DIR, "symptom_columns.json"), "w") as f:
        json.dump(symptom_columns, f, indent=2)
    with open(os.path.join(MODEL_DIR, "disease_classes.json"), "w") as f:
        json.dump(list(classes), f, indent=2)
    with open(os.path.join(MODEL_DIR, "evidence_vocab.json"), "w") as f:
        json.dump(evidence_vocab, f, indent=2)
    with open(os.path.join(MODEL_DIR, "condition_meta.json"), "w") as f:
        json.dump(condition_meta, f, indent=2)

    metrics = {
        "test_accuracy": acc,
        "test_top3_accuracy": top3_acc,
        "test_f1_macro": f1_macro,
        "test_precision_macro": precision_macro,
        "test_recall_macro": recall_macro,
        "n_train_samples": int(X_train.shape[0]),
        "n_test_samples": int(X_test.shape[0]),
        "n_features": int(X_train.shape[1]),
        "n_classes": int(len(classes)),
        "dataset": "DDXPlus (English), Mila/Universite de Montreal -- real clinical-knowledge-base-derived synthetic patients with overlapping symptom patterns",
        "note": "R^2 not applicable: multi-class classification task (disease name), not regression.",
        "model_choice_rationale": (
            "Random Forest selected over higher-raw-F1 alternatives (Logistic Regression, "
            "Naive Bayes) due to better-calibrated confidence on sparse/partial symptom "
            "input -- critical for realistic chatbot usage where users rarely report a "
            "full textbook symptom list."
        ),
    }
    with open(os.path.join(MODEL_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nSaved model + artifacts to: {MODEL_DIR}")


if __name__ == "__main__":
    main()
