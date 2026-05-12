from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.swap_schema import SwapData
from app.services.risk_engine import calculate_risk

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI MEV Risk Engine is running!"}

@app.post("/predict-risk")
def predict(data: SwapData):
    return calculate_risk(data)