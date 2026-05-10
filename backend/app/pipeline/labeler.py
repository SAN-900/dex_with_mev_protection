def label_data(features):
    risk = 0

    if features["priceImpact"] > 0.01:
        risk += 1

    if features["routeComplexity"] > 2:
        risk += 1

    if features["amount"] > 500:
        risk += 1

    return 1 if risk >= 2 else 0