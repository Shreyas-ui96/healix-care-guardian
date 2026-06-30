# Setup & Execution Instructions

This project has been integrated with a clinical disease prediction model trained on the Mila/DDXPlus dataset. Because the trained Random Forest classifier binary (`disease_classifier.joblib`, ~127MB) exceeds GitHub's 100MB file size limit, it has been ignored in Git. 

Follow the instructions below to set up and run the application locally.

---

## 1. Place the Model Binary File

You must place the trained model file in the backend directory for the prediction service to run:

1. Locate the file `disease_classifier.joblib` (~127MB). 
   * (If you are working inside the integrated workspace, you can copy it from the original `ddxplus/models/disease_classifier.joblib` folder).
2. Create the directory `backend/ml/models/` if it does not exist.
3. Paste the file under:
   ```path
   backend/ml/models/disease_classifier.joblib
   ```

Verify that the `backend/ml/models/` directory contains:
* `disease_classifier.joblib` (The classifier binary)
* `condition_meta.json` (Severity rating & metadata)
* `disease_classes.json` (Disease labels)
* `evidence_vocab.json` (Symptom definitions vocab)
* `symptom_columns.json` (Feature names)
* `metrics.json` (Accuracy parameters)

---

## 2. Install Dependencies

### A. Frontend & Node.js Backend
From the root workspace directory or the `healix-care-guardian` directory, install Node packages:
```bash
npm install
```
*(This installs React, Vite, Tailwind, Express, and `concurrently` to run the processes).*

### B. Python ML Backend
The ML microservice requires Python 3.10+ and standard data science libraries. Install them in your Python environment:
```bash
pip install pandas numpy scikit-learn joblib fastapi uvicorn pydantic
```

---

## 3. Run the Project

We have set up a concurrent script that launches all three servers simultaneously:
1. **React/Vite Frontend** (running on port `8080`)
2. **Node.js Express Backend** (running on port `3001`)
3. **Python FastAPI ML service** (running on port `5001`)

From either the root workspace directory or the `healix-care-guardian` directory, run:
```bash
npm run dev:all
```

Once started:
* Open `http://localhost:8080` in your browser.
* Click **Start Chat Consultation** to open the chat interface.
* Toggle the switch at the top to select **DDXPlus ML Diagnosis** mode.
* Type your initial symptoms (e.g. *"I have a headache and high fever"*).
* Proceed through the diagnostic interview by clicking the interactive **Yes**, **No**, or **Skip** buttons.
