from fastapi import FastAPI
from app.schemas.swap_schema import SwapData
from app.services.risk_engine import calculate_risk

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI MEV Risk Engine is running!"}

@app.post("/predict-risk")
def predict(data: SwapData):
    return calculate_risk(data)