"""
run_single_model.py — Train + evaluate ONE model, append result to model_comparison.csv.
Run once per model (separate process invocations) to keep each run within a
reasonable time budget. Usage:

    python run_single_model.py logreg
    python run_single_model.py dtree
    python run_single_model.py rf
    python run_single_model.py knn
    python run_single_model.py nb
"""
import os
import sys
import time
import warnings

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, top_k_accuracy_score
from sklearn.naive_bayes import BernoulliNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

warnings.filterwarnings("ignore")

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs")
RESULTS_PATH = os.path.join(OUT_DIR, "model_comparison.csv")

MODEL_REGISTRY = {
    "logreg": ("Logistic Regression", lambda: LogisticRegression(max_iter=500, random_state=42, n_jobs=-1)),
    "dtree": ("Decision Tree", lambda: DecisionTreeClassifier(max_depth=20, random_state=42)),
    "rf": ("Random Forest", lambda: RandomForestClassifier(n_estimators=150, max_depth=20, random_state=42, n_jobs=-1)),
    "knn": ("KNN (k=15)", lambda: KNeighborsClassifier(n_neighbors=15, n_jobs=-1)),
    "nb": ("Bernoulli Naive Bayes", lambda: BernoulliNB()),
}


def load_splits():
    X_train = pd.read_csv(os.path.join(OUT_DIR, "X_train.csv"))
    X_test = pd.read_csv(os.path.join(OUT_DIR, "X_test.csv"))
    y_train = pd.read_csv(os.path.join(OUT_DIR, "y_train.csv"))["label"].values
    y_test = pd.read_csv(os.path.join(OUT_DIR, "y_test.csv"))["label"].values
    return X_train, X_test, y_train, y_test


def main(model_key: str):
    name, model_fn = MODEL_REGISTRY[model_key]
    model = model_fn()

    X_train, X_test, y_train, y_test = load_splits()
    print(f"Training {name} on {X_train.shape[0]} rows...")

    t0 = time.time()
    model.fit(X_train, y_train)
    train_time = time.time() - t0

    preds = model.predict(X_test)
    test_acc = accuracy_score(y_test, preds)
    test_f1 = f1_score(y_test, preds, average="macro")

    top3_acc = None
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X_test)
        top3_acc = top_k_accuracy_score(y_test, proba, k=3, labels=model.classes_)

    result = {
        "model": name,
        "test_accuracy": test_acc,
        "test_top3_accuracy": top3_acc,
        "test_f1_macro": test_f1,
        "train_time_sec": train_time,
    }
    print(result)

    # Append to results CSV
    if os.path.exists(RESULTS_PATH):
        df = pd.read_csv(RESULTS_PATH)
        df = df[df["model"] != name]  # replace if rerun
        df = pd.concat([df, pd.DataFrame([result])], ignore_index=True)
    else:
        df = pd.DataFrame([result])
    df.to_csv(RESULTS_PATH, index=False)
    print(f"Saved to {RESULTS_PATH}")


if __name__ == "__main__":
    main(sys.argv[1])
