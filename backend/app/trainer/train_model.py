import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score

import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw_data.jsonl")
DATASET_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "services", "model.pkl")


def main():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError("dataset.csv not found. Run build_dataset first.")

    df = pd.read_csv(DATASET_PATH)

    # Basic sanity
    df = df.dropna()
    if len(df) < 50:
        raise ValueError("Not enough data. Let listener run longer.")

    X = df.drop(columns=["label"])
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    print("\n=== Evaluation ===")
    print(classification_report(y_test, preds))

    # Save
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")
    print("Accuracy:", accuracy_score(y_test, preds))

if __name__ == "__main__":
    main()
