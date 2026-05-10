
# Backend

AI-powered backend for Solana MEV risk prediction and swap protection.

---

# Features

- Real-time swap risk prediction
- Solana blockchain transaction ingestion
- Continuous ML retraining pipeline
- FastAPI inference API
- AI-based route safety analysis
- Dynamic protection scoring

---

# Architecture

```text
Solana Blockchain
        ↓
solana_listener.py
        ↓
raw_data.jsonl
        ↓
build_dataset.py
        ↓
dataset.csv
        ↓
train_model.py
        ↓
model.pkl
        ↓
risk_engine.py
        ↓
FastAPI
````

---

# Folder Structure

```text
backend/
├── app/
│   ├── listener/
│   ├── pipeline/
│   ├── trainer/
│   ├── services/
│   ├── schemas/
│   ├── data/
│   ├── main.py
│   └── runner.py
│
├── requirements.txt
└── README.md
```

---

# Tech Stack

* FastAPI
* Scikit-learn
* Pandas
* NumPy
* Solana.py
* Joblib

---

# Run Locally

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start API Server

```bash
uvicorn app.main:app --reload
```

---

## Run Continuous ML Engine

```bash
python app/runner.py
```

---

# API Endpoints

## Health Check

```text
GET /
```

## Predict Risk

```text
POST /predict-risk
```

Example Request:

```json
{
  "amount": 100,
  "slippage": 0.5,
  "liquidity": 100000,
  "priceImpact": 0.01,
  "routeComplexity": 2,
  "fee": 5000
}
```

Example Response:

```json
{
  "risk": 0.51,
  "level": "MEDIUM",
  "confidence": 0.51
}
```

---

# ML Pipeline

1. Listen to live Solana swap transactions
2. Extract transaction features
3. Build ML dataset
4. Train risk prediction model
5. Serve predictions through FastAPI

---

# Deployment

## Build Command

```bash
pip install -r requirements.txt
```

## Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

# Future Improvements

* Advanced DEX instruction decoding
* Real-time websocket monitoring
* Reinforcement learning execution engine
* Cross-chain MEV analysis

---

# License

MIT

