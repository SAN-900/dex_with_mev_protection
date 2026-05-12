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

    features = np.array([[
        data.amount,
        data.fee if hasattr(data, "fee") else 0.0,
        data.routeComplexity,
        data.routeComplexity,
        data.priceImpact
    ]])

    # ML probability
    ml_prob = model.predict_proba(features)[0][1]

    prob = ml_prob * 0.4

    # Heuristic adjustments
    if data.priceImpact > 0.08:
        prob += 0.25

    elif data.priceImpact > 0.03:
        prob += 0.12

    if data.routeComplexity > 3:
        prob += 0.2

    elif data.routeComplexity > 1:
        prob += 0.08

    if data.amount > 10:
        prob += 0.15

    elif data.amount > 3:
        prob += 0.07


    prob = max(0.05, min(prob, 0.95))
    level = (
        "HIGH" if prob > 0.8
        else "MEDIUM" if prob > 0.5
        else "LOW"
    )

    return {
        "risk": float(prob),
        "level": level,
        "confidence": float(min(prob + 0.1, 0.99))
    }