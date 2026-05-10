import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "services", "model.pkl")


_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("Model not found. Train it first.")
        _model = joblib.load(MODEL_PATH)
    return _model

def calculate_risk(data):
    model = get_model()

    instruction_count = getattr(data, "instruction_count", data.routeComplexity)

    features = np.array([[
        data.amount,
        data.fee if hasattr(data, "fee") else 0.0,
        instruction_count,
        data.routeComplexity,
        data.priceImpact
    ]])

    prob = model.predict_proba(features)[0][1]

    return {
        "risk": float(prob),
        "level": "HIGH" if prob > 0.7 else "MEDIUM" if prob > 0.4 else "LOW",
        "confidence": float(prob)
    }