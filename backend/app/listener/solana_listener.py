import time
import json
from solana.rpc.api import Client

import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw_data.jsonl")
DATASET_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "services", "model.pkl")

RPC_URL = "https://api.mainnet-beta.solana.com"
client = Client(RPC_URL)


DEX_PROGRAMS = {
    #Jupiter
    "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",

    #Orca Whirlpool
    "whirLbMiicVdio4qvUfM5K9D9rj7kC9GZr5o2FZ1h1h",

    #Raydium AMM
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9GdbkK5R6N3F"
}


def fetch_block_transactions():
    try:
        slot_resp = client.get_slot()
        slot = slot_resp.value  

        block_resp = client.get_block(
            slot,
            encoding="json",
            max_supported_transaction_version=0
        )

        if not block_resp.value:
            return []

        return block_resp.value.transactions

    except Exception as e:
        print("Error fetching block:", e)
        return []


def is_swap(tx):
    try:
        tx_json = json.loads(tx.to_json())

        meta = tx_json.get("meta", {})
        logs = meta.get("logMessages", []) or []

        if any("Vote111111111111111111111111111111111111111" in log for log in logs):
            return False

        # Token balance changes
        pre_balances = meta.get("preTokenBalances", [])
        post_balances = meta.get("postTokenBalances", [])

        # Need at least 2 token accounts changing
        if len(post_balances) < 2:
            return False

        # Detect balance movement
        token_changed = False

        for pre, post in zip(pre_balances, post_balances):
            pre_amt = float(pre.get("uiTokenAmount", {}).get("uiAmount", 0) or 0)
            post_amt = float(post.get("uiTokenAmount", {}).get("uiAmount", 0) or 0)

            if pre_amt != post_amt:
                token_changed = True
                break

        return token_changed

    except Exception as e:
        print("Swap parse error:", e)
        return False

def save_tx(tx):
    try:
        # convert to JSON-safe dict
        tx_dict = tx.to_json()

        with open(RAW_PATH, "a") as f:
            f.write(tx_dict + "\n")

    except Exception as e:
        print("Save error:", e)


def run_listener():
    print("Listening to Solana transactions...")

    while True:
        txs = fetch_block_transactions()

        for tx in txs:
            print("Checking tx...")
            if is_swap(tx):
                save_tx(tx)
                print("Saved swap tx")

        time.sleep(2)


if __name__ == "__main__":
    run_listener()
