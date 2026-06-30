"""
01b_augment_partial_inputs.py — Augment the training set with partial-symptom
rows to teach the model to handle realistic chatbot input.

WHY THIS IS NEEDED:
DDXPlus synthetic patients report ~16 symptoms on average (full clinical
interview trace). A real chatbot user reports 3-8 symptoms spontaneously.
Without augmentation, the model scores low confidence on any sparse input
(tested: 11 core Pneumonia symptoms only reached 28% confidence) because
partial-symptom vectors look nothing like the 16+ feature training examples.

APPROACH:
For each training row, randomly drop 40-85% of its present symptoms to create
multiple partial-view versions of the same patient. Each partial row keeps the
same disease label. This forces the model to learn which symptoms are truly
discriminating for each disease, rather than depending on the full rich feature
vector that a simulated clinical interview produces. This is standard practice
in medical AI for training under incomplete observations.

We generate augmented rows equal to 2x the existing training set size (enough
to substantially shift the model's exposure to sparse inputs without losing the
full-symptom training signal).

Run AFTER 01_preprocess_ddxplus.py, BEFORE 03_train_final_model_ddxplus.py:
    python 01b_augment_partial_inputs.py
"""
import os

import numpy as np
import pandas as pd

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "outputs")
RANDOM_STATE = 42
AUGMENT_MULTIPLIER = 2       # generate this many augmented rows per original row
MIN_SYMPTOMS_KEEP = 2        # always keep at least this many symptoms
DROP_RATE_MIN = 0.40         # randomly drop between 40% and 85% of present symptoms
DROP_RATE_MAX = 0.85


def augment(X_train: pd.DataFrame, y_train: pd.Series, rng: np.random.Generator) -> tuple:
    """
    For each original row, generate AUGMENT_MULTIPLIER random partial views
    by masking out a random fraction of its active symptom columns.
    """
    augmented_X = []
    augmented_y = []
    total_original = len(X_train)

    for i in range(total_original):
        row = X_train.iloc[i].values.copy()
        label = y_train.iloc[i]
        present_idx = np.where(row == 1)[0]
        n_present = len(present_idx)

        for _ in range(AUGMENT_MULTIPLIER):
            drop_rate = rng.uniform(DROP_RATE_MIN, DROP_RATE_MAX)
            n_drop = max(0, min(int(n_present * drop_rate), n_present - MIN_SYMPTOMS_KEEP))
            if n_drop > 0:
                drop_idx = rng.choice(present_idx, size=n_drop, replace=False)
                aug_row = row.copy()
                aug_row[drop_idx] = 0
            else:
                aug_row = row.copy()
            augmented_X.append(aug_row)
            augmented_y.append(label)

    aug_X_df = pd.DataFrame(augmented_X, columns=X_train.columns, dtype=np.int8)
    aug_y_series = pd.Series(augmented_y, name="label")
    return aug_X_df, aug_y_series


def main():
    X_train = pd.read_csv(os.path.join(OUT_DIR, "X_train.csv"))
    y_train = pd.read_csv(os.path.join(OUT_DIR, "y_train.csv"))["label"]
    print(f"Original train set: {X_train.shape[0]} rows")

    rng = np.random.default_rng(RANDOM_STATE)
    aug_X, aug_y = augment(X_train, y_train, rng)
    print(f"Generated augmented rows: {len(aug_X)}")

    # Combine original + augmented, then shuffle
    X_combined = pd.concat([X_train, aug_X], ignore_index=True)
    y_combined = pd.concat([y_train, aug_y], ignore_index=True)
    shuffle_idx = rng.permutation(len(X_combined))
    X_combined = X_combined.iloc[shuffle_idx].reset_index(drop=True)
    y_combined = y_combined.iloc[shuffle_idx].reset_index(drop=True)

    print(f"Combined train set (original + augmented): {X_combined.shape[0]} rows")

    # Verify symptom count distribution improved
    sym_counts = (X_combined == 1).sum(axis=1)
    print("\nSymptom count distribution after augmentation:")
    print(f"  <5  : {(sym_counts<5).sum():5d} ({100*(sym_counts<5).mean():.1f}%)")
    print(f"  5-10: {((sym_counts>=5)&(sym_counts<10)).sum():5d} ({100*((sym_counts>=5)&(sym_counts<10)).mean():.1f}%)")
    print(f"  10+ : {(sym_counts>=10).sum():5d} ({100*(sym_counts>=10).mean():.1f}%)")
    print(f"  mean: {sym_counts.mean():.1f}")

    # Save, overwriting X_train with augmented version
    # (X_test stays unchanged — we test on real full-ish symptom vectors
    #  so the accuracy number reflects full-input performance, but we'll
    #  also run a separate sparse-input stress test to validate partial coverage)
    X_combined.to_csv(os.path.join(OUT_DIR, "X_train.csv"), index=False)
    y_combined.to_csv(os.path.join(OUT_DIR, "y_train.csv"), index=False)
    print(f"\nSaved augmented train set to {OUT_DIR}/X_train.csv")


if __name__ == "__main__":
    main()
