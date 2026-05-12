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
        data.slippage,
        data.fee if hasattr(data, "fee") else 0.0,
        data.routeComplexity,
        data.instruction_count,
        data.priceImpact
    ]])

    # ML probability
    probs = model.predict_proba(features)[0]

    ml_prob = ( probs[1] * 0.5 + probs[2] * 1.0 ) 

    confidence = max(probs)


    prob = ml_prob * 0.4


    # mild heuristic calibration only

    if data.priceImpact > 0.1:
        ml_prob += 0.08

    if data.routeComplexity > 5:
        ml_prob += 0.05

    prob = max(0.05, min(ml_prob, 0.95))

    level = ( "HIGH" if prob > 0.75 else "MEDIUM" if prob > 0.4 else "LOW" )

    return {
        "risk": float(prob),
        "level": level,
        "confidence": float(confidence)
    }