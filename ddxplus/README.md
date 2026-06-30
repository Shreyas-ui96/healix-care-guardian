# DDXPlus Disease Prediction System

A production-quality disease classifier trained on the **DDXPlus** dataset —
a real, clinically-grounded synthetic patient dataset from Mila / Université de
Montréal, used here specifically because it fixes the fundamental flaw of
simpler disease-symptom datasets.

---

## Dataset

**DDXPlus (English version)**
- Source: https://figshare.com/articles/dataset/DDXPlus_Dataset_English_/22687585
- Paper: https://arxiv.org/abs/2205.09148
- License: CC-BY 4.0 (research use)

**Why DDXPlus and not the simpler Kaggle disease-symptom datasets:**
The commonly-used Kaggle "Disease Symptom Prediction" dataset (itachi9604) has
**zero symptom overlap between any two diseases** — every disease has a unique,
non-overlapping symptom fingerprint. Any classifier trivially memorizes this as
a lookup table and scores ~100% accuracy, which tells you nothing about real
diagnostic ability. We verified this explicitly: all 7 tested models tied at
100%, and the dataset had 0 of 1,176 disease pairs sharing any symptoms.

DDXPlus was built from a proprietary clinical knowledge base reviewed by doctors
and compiled from 20,000+ medical papers. **84% of disease pairs (990/1,176)
share at least one symptom**, with realistic confusable pairs like
Influenza/Pneumonia sharing 21 evidences. Models trained on it must actually
learn to discriminate, not memorize.

**Files used:**
- `release_conditions.json` — 49 diseases with symptoms, antecedents, ICD-10
  codes, severity ratings (1=most severe, 5=least severe)
- `release_evidences.json` — 223 clinical evidence definitions with English
  question text (e.g. "Do you have a fever?")
- `release_train_patients.zip` — 1,025,602 synthetic patient records

---

## Pipeline

```
ddxplus/
├── data/                               # raw downloaded files
│   ├── release_conditions.json
│   ├── release_evidences.json
│   └── release_train_patients.csv
├── notebooks/
│   ├── 01_preprocess_ddxplus.py        # parse, sample, dedupe, build multi-hot matrix
│   ├── 02_model_comparison_ddxplus.py  # benchmark 5 classifiers
│   ├── run_single_model.py             # run one model at a time (called by 02)
│   └── 03_train_final_model_ddxplus.py # train + save production model
├── outputs/                            # cleaned train/test splits, comparison table
├── models/                             # trained model + deployment artifacts
│   ├── disease_classifier.joblib
│   ├── symptom_columns.json
│   ├── disease_classes.json
│   ├── evidence_vocab.json             # {code: {key, question, is_antecedent}}
│   ├── condition_meta.json             # {disease: {severity, icd10}}
│   └── metrics.json
├── inference.py                        # production inference + safety net
└── router_disease.py                   # FastAPI router (copy into your backend)
```

**Run the full pipeline from scratch:**
```bash
pip install -r requirements.txt
python notebooks/01_preprocess_ddxplus.py
python notebooks/run_single_model.py nb
python notebooks/run_single_model.py logreg
python notebooks/run_single_model.py rf
python notebooks/run_single_model.py knn
python notebooks/run_single_model.py dtree
python notebooks/03_train_final_model_ddxplus.py
```
The trained model is already included in `models/` — only re-run if you want
to retrain from scratch.

---

## Model Selection & Metrics

5 classifiers benchmarked on the cleaned, leakage-free dataset:

| Model | Test Accuracy | Top-3 Accuracy | Test F1 (macro) |
|---|---|---|---|
| Logistic Regression | 0.9868 | 0.9998 | 0.9771 |
| Bernoulli Naive Bayes | 0.9879 | 0.9991 | 0.9717 |
| KNN (k=15) | 0.9792 | 0.9998 | 0.9709 |
| **Random Forest** | **0.9736** | **0.9909** | **0.8878** |
| Decision Tree | 0.8629 | 0.9167 | 0.7499 |

**Selected: Random Forest** — not the highest raw F1, but the best choice for
a chatbot because it gives well-calibrated confidence scores. Naive Bayes scored
98.6% confidence from just "fever + cough" (wildly overconfident on sparse
input). Random Forest gave 21.8% for the same input — honest uncertainty that
lets the chatbot correctly ask for more information instead of claiming a
confident wrong answer.

**R² is not reported** — R² is a regression metric. This is multi-class
classification (predicting one of 49 disease names, a category). R² has no
valid interpretation here. The equivalent metrics for classification are
accuracy, precision, recall, and F1 (all reported above).

**Data quality notes:**
- 1,025,602 raw rows sampled to 1,500/disease (balanced), then deduplicated
- DDXPlus's synthetic generator produces many identical symptom vectors per
  disease (~62% were duplicates after deduplication); without removing these
  first, ~34% of a naive test split was verbatim train rows, inflating scores
- After dedup: 26,869 unique rows, 21,495 train / 5,374 test (stratified)
- No train/test leakage verified (0 same-label identical rows across split)

---

## The Partial-Input Safety Net

**Understanding how DDXPlus was designed:**
DDXPlus patients report ~16 symptoms on average — the result of a simulated
multi-turn clinical interview that collects a full evidence trace. A real
chatbot user reports 3-8 symptoms spontaneously. This creates a gap: with
fewer than ~15-20 symptoms, confidence stays below 30% even on correct inputs,
because partial symptom vectors don't resemble the training examples.

**This is not a bug — it's the design.** DDXPlus was explicitly built for
interactive symptom collection (the paper's title is "Automatic Symptom
Detection"). The model performs perfectly when it has sufficient evidence, and
appropriately signals uncertainty when it doesn't.

**How `inference.py` handles this:**
1. **Confidence tiers**: every prediction includes `confidence_tier`
   (high/medium/low) in addition to the raw float. Use this in your chatbot
   rather than the raw number.
2. **`diagnosis_available` gate**: when confidence is low OR fewer than
   `MIN_EVIDENCE_COUNT` symptoms are given, the response explicitly sets
   `diagnosis_available=False` — your chatbot should not present a result in
   this state.
3. **`follow_up_question`**: when `diagnosis_available=False`, the response
   includes a suggested next question to ask (the symptom most likely to
   increase confidence for the current top candidate disease). This is the
   mechanism for iteratively collecting enough evidence.

**Correct chatbot loop:**
```
ask initial symptoms
loop:
    POST /api/v1/disease/predict with all collected symptoms so far
    if diagnosis_available == True:
        show result, break
    else:
        ask follow_up_question.question
        add user's answer to symptom list
        continue loop
```

---

## Confidence at different symptom counts (Pneumonia example):

| Symptoms given | Mean confidence | Top-1 accuracy |
|---|---|---|
| 2 | 0.11 | 0.000 |
| 4 | 0.15 | 0.000 |
| 8 | 0.16 | 0.000 |
| 15 | 0.18 | 0.310 |
| 20 | 0.31 | 0.883 |
| All (~31) | **0.983** | **1.000** |

This table is the honest answer to "how accurate is it?" — it depends entirely
on how many targeted questions the chatbot asks. With a good follow-up question
loop, reaching 15-20 collected evidences is achievable in a few rounds of
conversation and yields strong, reliable predictions.

---

## Backend Integration

1. Copy `models/` and `inference.py` into your backend:
   ```
   symptom-checker-backend/
   └── app/
       └── ml/
           ├── inference.py
           └── models/
               ├── disease_classifier.joblib
               ├── symptom_columns.json
               ├── disease_classes.json
               ├── evidence_vocab.json
               ├── condition_meta.json
               └── metrics.json
   ```
2. Copy `router_disease.py` -> `app/routers/disease.py`, update the import path:
   ```python
   from app.ml.inference import predictor
   ```
3. Register in `app/main.py`:
   ```python
   from app.routers import disease
   app.include_router(disease.router)
   ```
4. New endpoints:
   - `POST /api/v1/disease/predict` — main prediction endpoint
   - `GET /api/v1/disease/symptoms` — list all 223 symptom keys + questions
   - `GET /api/v1/disease/diseases` — list all 49 disease names

---

## Frontend Integration

```javascript
async function diagnose(symptoms) {
  const res = await fetch("https://your-backend.com/api/v1/disease/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms, top_k: 3 })
  });
  const data = await res.json();

  if (!data.diagnosis_available) {
    // Ask the follow-up question and loop
    const answer = await askUser(data.follow_up_question.question);
    if (answer) symptoms.push(data.follow_up_question.symptom_key);
    return diagnose(symptoms);  // recurse with expanded symptoms
  }

  // Diagnosis available
  const top = data.predictions[0];
  showResult({
    disease: top.disease,
    confidence: top.confidence_tier,  // "high" / "medium"
    severity: top.severity,           // 1-5 (1=most severe)
    warning: data.warning
  });
}
```

---

## Disclaimer

This system is for educational/research purposes only. DDXPlus is a synthetic
dataset — patients were generated by a clinical rule-based simulator, not from
real medical records. The model has not been clinically validated and must not
be used as a sole basis for any real medical decision. Always direct users to
consult a licensed healthcare professional.
