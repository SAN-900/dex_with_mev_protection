import json
import os
import random

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw_data.jsonl")
DATASET_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "services", "model.pkl")

def extract_features(tx_json_str):
    try:
        tx = json.loads(tx_json_str)

        meta = tx.get("meta", {})
        message = tx.get("transaction", {}).get("message", {})

        fee = meta.get("fee", 0)
        instructions = message.get("instructions", [])

        # features
        instruction_count = len(instructions)
        log_messages = meta.get("logMessages", []) or []

        is_swap = any("swap" in log.lower() for log in log_messages)

        if not is_swap:
            return None

        amount = round((fee / 5000) * 0.01, 4) 
        slippage = round(random.uniform(0.1, 2.0), 2)
        route_complexity = max(1,instruction_count // 2)
        price_impact = round( min(0.3, route_complexity * 0.015), 4 )

        return {
            "amount": amount,
            "slippage": slippage,
            "fee": fee,
            "routeComplexity": route_complexity,
            "instruction_count": instruction_count,
            "priceImpact": price_impact,
        }

    except Exception as e:
        return None