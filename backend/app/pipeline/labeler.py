def label_data(features):
    risk = 0

    if features["priceImpact"] > 0.08:
        risk += 1
    if features["routeComplexity"] > 3:
        risk += 1
    if features["amount"] > 10:
        risk += 1
    if features["slippage"] > 1:
        risk += 1
    return 1 if risk >= 2 else 0
