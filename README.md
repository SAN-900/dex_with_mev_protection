# AI-Powered MEV Protection Engine

A full-stack AI + Web3 system built on Solana for intelligent swap risk prediction and MEV-aware transaction protection.

## Repositories Structure

```text
project/
├── client/     → Frontend application
├── server/     → Jupiter proxy server
└── backend/    → AI + ML backend
````

---

# Components

## Client

Frontend application for:

* wallet connection
* token swap UI
* risk visualization
* MEV alerts
* transaction execution

## Server

Proxy server for:

* Jupiter API integration
* quote generation
* swap transaction creation
* token list retrieval

## Backend

AI engine for:

* Solana data ingestion
* ML training pipeline
* risk prediction
* continuous retraining

---

# Complete Architecture

```text
Frontend (client)
        ↓
Jupiter Proxy Server (server)
        ↓
AI Backend (backend)
        ↓
ML Risk Engine
        ↓
Solana Blockchain
```

---

# Deployment

## Client

Deploy on:

* Vercel
* Netlify

## Server

Deploy on:

* Render
* Railway

## Backend

Deploy on:

* Render
* Railway

---

# License

MIT

````

---

# client/README.md

```md
# Client

Frontend application for the AI-powered MEV protection system.

## Features

- Solana wallet connection
- Jupiter-powered token swaps
- Real-time AI risk prediction
- Dynamic slippage protection
- Route safety analysis
- MEV warning system

## Tech Stack

- React
- TypeScript
- TailwindCSS
- Solana Wallet Adapter
- Jupiter API

## Run Locally

```bash
npm install
npm run dev
````

## Environment Variables

```env
VITE_API_URL=your_backend_url
VITE_PROXY_URL=your_proxy_url
```

````

---

# server/README.md

```md
# Jupiter Proxy Server

Backend proxy server for secure interaction with Jupiter APIs.

## Responsibilities

- Fetch swap quotes
- Generate swap transactions
- Fetch supported tokens
- Handle API proxy requests

## Tech Stack

- Node.js
- Express
- TypeScript

## Endpoints

```text
/jupiter/quote
/jupiter/swap
/jupiter/tokens
````

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

````

---

# backend/README.md

```md
# AI-Powered MEV Protection Engine for Solana

An AI + Web3 system that predicts risky swap execution conditions on Solana and applies intelligent protection mechanisms before transaction execution.

---

## Features

- Real-time swap risk prediction
- AI-powered execution safety engine
- Solana blockchain transaction ingestion
- Continuous ML retraining pipeline
- Jupiter swap integration
- Dynamic slippage protection
- Route complexity analysis
- Live frontend risk visualization

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
        ↓
Frontend
````

---

# Tech Stack

## Frontend

* React
* TypeScript
* TailwindCSS
* Solana Wallet Adapter
* Jupiter API

## Backend

* FastAPI
* Scikit-learn
* Solana.py
* Pandas
* NumPy

## Blockchain

* Solana
* Jupiter Aggregator

---

# Backend Structure

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

# Setup

## Backend

```bash
pip install -r requirements.txt
```

Run API:

```bash
uvicorn app.main:app --reload
```

Run Continuous ML Engine:

```bash
python app/runner.py
```

---

# API Endpoints

## Health Check

```text
GET /
```

## Risk Prediction

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

# AI Pipeline

1. Listen to live Solana swap transactions
2. Extract swap features
3. Build ML dataset
4. Train risk prediction model
5. Serve predictions via FastAPI

---

# Auto Protection System

The frontend includes an automatic protection layer that reacts dynamically to AI risk predictions before swap execution.

## Protection Features

* Automatic slippage reduction
* Unsafe route detection
* Large trade warnings
* Route complexity analysis
* AI-generated risk scoring

## Protection Logic

```text
AI Risk Score
      ↓
Risk Analysis
      ↓
Protection Rules
      ↓
Swap Decision
```

Example:

* High-risk swap → warning shown
* Complex route → transaction blocked
* Large swap → split trade recommendation
* Unsafe conditions → slippage tightened automatically

---

# Live Testing URLs

## Frontend

```text
https://aroha-dex.vercel.app/
```

## AI Backend API

```text
https://dex-with-mev-protection-ml.onrender.com/docs
```

## Jupiter Proxy Server

```text
https://your-jupiter-server.onrender.com/jupiter/tokens
```

---

# Future Improvements

* Real DEX instruction decoding
* Advanced MEV pattern detection
* Reinforcement learning execution
* Streaming data pipeline
* Websocket live monitoring

---

# License

MIT

````

---

# backend/app/listener/README.md

```md
# Listener Module

This module listens to live Solana blockchain transactions and filters swap-like token movement transactions.

## Responsibilities

- Fetch latest Solana blocks
- Parse transactions
- Detect swap-like activity
- Store raw transaction data

## Main File

- `solana_listener.py`

## Output

Transactions are stored in:

```text
app/data/raw_data.jsonl
````

````

---

# backend/app/pipeline/README.md

```md
# Pipeline Module

This module converts raw blockchain transactions into structured machine learning datasets.

## Responsibilities

- Extract ML features
- Generate heuristic labels
- Build structured dataset

## Files

- `feature_builder.py`
- `labeler.py`
- `build_dataset.py`

## Output

```text
app/data/dataset.csv
````

````

---

# backend/app/trainer/README.md

```md
# Trainer Module

This module trains the machine learning model used for risk prediction.

## Responsibilities

- Load dataset
- Train classifier
- Save trained model

## Main File

- `train_model.py`

## Output

```text
app/services/model.pkl
````

````

---

# backend/app/services/README.md

```md
# Services Module

This module contains the ML inference engine.

## Responsibilities

- Load trained model
- Run inference
- Return risk prediction

## Files

- `risk_engine.py`
- `model.pkl`
````

---

# backend/app/schemas/README.md

```md
# Schemas Module

This module contains request validation schemas used by FastAPI.

## Responsibilities

- Validate API request payloads
- Define prediction input structure

## Files

- `swap_schema.py`
```

---

# backend/app/data/README.md

```md
# Data Module

This folder stores raw blockchain data and structured ML datasets.

## Files

- `raw_data.jsonl`
- `dataset.csv`

## Notes

These files are excluded from Git tracking using `.gitignore`.
```

---

# backend/app/README.md

```md
# App Module

Core backend application for the AI-powered MEV protection engine.

## Components

- Blockchain listener
- ML pipeline
- Model trainer
- FastAPI inference server
- Continuous retraining engine

## Entry Files

- `main.py`
- `runner.py`