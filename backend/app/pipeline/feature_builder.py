import json
import os

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

        # crude proxies (improve later)
        amount = fee / 1e6
        price_impact = fee / 1e7

        return {
            "amount": amount,
            "fee": fee,
            "instruction_count": instruction_count,
            "routeComplexity": instruction_count,
            "priceImpact": price_impact,
        }

    except Exception as e:
        return None