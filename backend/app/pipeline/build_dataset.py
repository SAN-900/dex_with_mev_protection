import pandas as pd
from feature_builder import extract_features
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw_data.jsonl")
DATASET_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "services", "model.pkl")
INPUT_FILE = RAW_PATH
OUTPUT_FILE = DATASET_PATH

data = []

with open(INPUT_FILE, "r") as f:
    for line in f:
        features = extract_features(line)

        if not features:
            continue

        # simple label (temporary heuristic)
        label = 1 if features["priceImpact"] > 0.01 else 0
        features["label"] = label

        data.append(features)

df = pd.DataFrame(data)
df.to_csv(OUTPUT_FILE, index=False)

print("Dataset created:", len(df))