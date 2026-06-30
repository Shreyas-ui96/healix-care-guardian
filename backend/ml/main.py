from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn
import os
import sys

# Ensure backend/ml is in the python path
_THIS_DIR = os.path.dirname(os.path.abspath(__file__))
if _THIS_DIR not in sys.path:
    sys.path.insert(0, _THIS_DIR)

from inference import predictor

app = FastAPI(
    title="Healix Care Guardian ML Disease Prediction Service",
    description="Microservice providing Random Forest-based clinical triage prediction using DDXPlus dataset.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    symptoms: List[str] = Field(..., min_length=1)
    exclude_symptoms: Optional[List[str]] = Field(default=None)
    top_k: int = Field(default=3, ge=1, le=10)

class Prediction(BaseModel):
    disease: str
    confidence: float
    confidence_tier: str   # "high" / "medium" / "low"
    severity: Optional[int]  # 1 (most severe) to 5 (least severe)

class FollowUpQuestion(BaseModel):
    symptom_key: str
    question: str
    asked_to_help_distinguish: Optional[str]

class PredictResponse(BaseModel):
    diagnosis_available: bool
    predictions: List[Prediction]
    recognized_symptoms: List[str]
    unrecognized_symptoms: List[str]
    follow_up_question: Optional[FollowUpQuestion]
    warning: Optional[str]
    disclaimer: str = (
        "Educational/research tool only. Based on DDXPlus (Mila), a synthetic "
        "dataset. Not clinically validated. Not a substitute for professional "
        "medical diagnosis."
    )

@app.get("/api/v1/disease/symptoms")
def list_symptoms():
    """All recognized symptom keys and their full question text."""
    return {"symptoms": predictor.known_symptoms()}

@app.get("/api/v1/disease/diseases")
def list_diseases():
    """All 49 predictable disease names."""
    return {"diseases": predictor.known_diseases()}

@app.post("/api/v1/disease/predict", response_model=PredictResponse)
def predict_disease(payload: PredictRequest):
    """
    Predict disease from symptoms with a partial-input safety net.
    Check `diagnosis_available` first to decide whether to query further.
    """
    if not payload.symptoms:
        raise HTTPException(status_code=400, detail="At least one symptom is required.")
    
    # Predict using the disease predictor model
    result = predictor.predict(payload.symptoms, top_k=payload.top_k, exclude_symptoms=payload.exclude_symptoms)
    return PredictResponse(**result)

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Healix Care Guardian ML",
        "loaded_symptoms": len(predictor.symptom_columns),
        "loaded_diseases": len(predictor.disease_classes)
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=False)
