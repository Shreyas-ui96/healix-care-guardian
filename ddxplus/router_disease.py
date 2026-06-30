"""
router_disease.py — FastAPI router for the DDXPlus disease predictor.

Drop-in for your existing symptom-checker backend:
1. Copy this file -> symptom-checker-backend/app/routers/disease.py
2. Copy the entire ddxplus/models/ folder into your backend
3. Copy ddxplus/inference.py -> symptom-checker-backend/app/ml/inference.py
4. In app/main.py:
      from app.routers import disease
      app.include_router(disease.router)

CHATBOT FLOW:
A production chatbot using this model should follow a loop:
  1. Collect 1-2 initial symptoms from the user
  2. POST to /api/v1/disease/predict
  3. If response.diagnosis_available == False:
       - Show response.follow_up_question.question to the user
       - Collect their answer (yes/no or a new symptom key)
       - Add to symptoms list, go back to step 2
  4. If response.diagnosis_available == True (or user wants to stop):
       - Show response.predictions[0].disease and confidence_tier
       - Show severity info
       - Hand off to the severity/treatment engine (/api/v1/check)
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.ml.inference import predictor   # adjust import path as needed

router = APIRouter(prefix="/api/v1/disease", tags=["disease-prediction"])


class PredictRequest(BaseModel):
    symptoms: List[str] = Field(..., min_length=1)
    top_k: int = Field(default=3, ge=1, le=10)


class Prediction(BaseModel):
    disease: str
    confidence: float
    confidence_tier: str   # "high" / "medium" / "low"
    severity: Optional[int]  # 1 (most severe) to 5 (least severe), from DDXPlus


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


@router.get("/symptoms")
def list_symptoms():
    """All recognized symptom keys and their full question text for chatbot display."""
    return {"symptoms": predictor.known_symptoms()}


@router.get("/diseases")
def list_diseases():
    """All 49 predictable disease names."""
    return {"diseases": predictor.known_diseases()}


@router.post("/predict", response_model=PredictResponse)
def predict_disease(payload: PredictRequest):
    """
    Predict disease from symptoms with a partial-input safety net.

    IMPORTANT: check `diagnosis_available` first.
    - True  -> a confident prediction is available; show predictions[0]
    - False -> not enough evidence yet; ask the user follow_up_question.question
               and call this endpoint again with the expanded symptoms list.

    This design lets the chatbot iteratively collect evidence rather than guessing
    from too little information.
    """
    if not payload.symptoms:
        raise HTTPException(status_code=400, detail="At least one symptom is required.")
    result = predictor.predict(payload.symptoms, top_k=payload.top_k)
    return PredictResponse(**result)
