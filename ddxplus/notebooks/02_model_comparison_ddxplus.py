"""
02_model_comparison_ddxplus.py — Compare classifiers on the DDXPlus-derived
dataset (realistic, overlapping symptom patterns -- unlike the earlier Kaggle
dataset where every disease had a unique non-overlapping symptom fingerprint).

Expect LOWER accuracy than the old project here, and that's the point: with
genuine symptom overlap between diseases (e.g. Influenza vs Pneumonia sharing 21
evidences), a model has to actually learn discriminating patterns instead of
memorizing a lookup table. A 70-85% range here is a much more meaningful and
trustworthy number than the old dataset's 100%.

Run:
    python 02_model_comparison_ddxplus.py
"""
import os
import time
import warnings

import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score, top_k_accuracy_score
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.naive_bayes import BernoulliNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

warnings.filterwarnings("ignore")

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs")


def load_splits():
    X_train = pd.read_csv(os.path.join(OUT_DIR, "X_train.csv"))
    X_test = pd.read_csv(os.path.join(OUT_DIR, "X_test.csv"))
    y_train = pd.read_csv(os.path.join(OUT_DIR, "y_train.csv"))["label"].values
    y_test = pd.read_csv(os.path.join(OUT_DIR, "y_test.csv"))["label"].values
    classes = pd.read_csv(os.path.join(OUT_DIR, "label_classes.csv"))["disease"].values
    return X_train, X_test, y_train, y_test, classes


def get_candidate_models() -> dict:
    return {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42, n_jobs=-1),
        "Decision Tree": DecisionTreeClassifier(max_depth=20, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=20, random_state=42, n_jobs=-1),
        "KNN (k=15)": KNeighborsClassifier(n_neighbors=15, n_jobs=-1),
        "Bernoulli Naive Bayes": BernoulliNB(),  # well-suited to binary symptom features
    }


def main():
    X_train, X_test, y_train, y_test, classes = load_splits()
    print(f"Train: {X_train.shape}, Test: {X_test.shape}, Classes: {len(classes)}\n")

    models = get_candidate_models()
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    CV_SAMPLE_SIZE = 8000

    results = []
    print(f"{'Model':<22} {'CV Acc (mean±std)':<22} {'Test Acc':<10} {'Top-3 Acc':<11} {'Test F1(macro)':<15} {'Time(s)'}")
    print("-" * 100)

    for name, model in models.items():
        t0 = time.time()
        # Use a subsample for CV scoring on the bigger models to keep runtime reasonable
        cv_sample_idx = X_train.sample(n=min(CV_SAMPLE_SIZE, len(X_train)), random_state=42).index
        cv_scores = cross_val_score(
            model, X_train.loc[cv_sample_idx], y_train[cv_sample_idx], cv=cv, scoring="accuracy", n_jobs=1
        )
        model.fit(X_train, y_train)
        train_time = time.time() - t0

        preds = model.predict(X_test)
        test_acc = accuracy_score(y_test, preds)
        test_f1 = f1_score(y_test, preds, average="macro")

        top3_acc = None
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(X_test)
            top3_acc = top_k_accuracy_score(y_test, proba, k=3, labels=model.classes_)

        results.append({
            "model": name,
            "cv_acc_mean": cv_scores.mean(),
            "cv_acc_std": cv_scores.std(),
            "test_accuracy": test_acc,
            "test_top3_accuracy": top3_acc,
            "test_f1_macro": test_f1,
            "train_time_sec": train_time,
        })

        top3_str = f"{top3_acc:.3f}" if top3_acc is not None else "n/a"
        print(f"{name:<22} {cv_scores.mean():.3f} ± {cv_scores.std():.3f}      "
              f"{test_acc:<10.3f} {top3_str:<11} {test_f1:<15.3f} {train_time:.1f}")

        # Save incrementally so partial progress survives if the run is interrupted
        pd.DataFrame(results).to_csv(os.path.join(OUT_DIR, "model_comparison.csv"), index=False)

    results_df = pd.DataFrame(results).sort_values("test_f1_macro", ascending=False).reset_index(drop=True)
    results_df.to_csv(os.path.join(OUT_DIR, "model_comparison.csv"), index=False)

    best = results_df.iloc[0]
    print(f"\n{'='*60}")
    print(f"BEST MODEL: {best['model']}")
    print(f"  Test Accuracy:       {best['test_accuracy']:.4f}")
    print(f"  Test Top-3 Accuracy: {best['test_top3_accuracy']:.4f}  (true disease in top 3 guesses)")
    print(f"  Test F1 (macro):     {best['test_f1_macro']:.4f}")
    print(f"{'='*60}")

    best_model = models[best["model"]]
    preds = best_model.predict(X_test)
    print("\nDetailed classification report (best model, test set):")
    print(classification_report(y_test, preds, target_names=classes, zero_division=0))

    return results_df


if __name__ == "__main__":
    main()
