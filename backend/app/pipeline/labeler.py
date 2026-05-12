def label_data(features):

    score = 0

    # Significant price impact
    if features["priceImpact"] > 0.08:
        score += 1

    # Complex route
    if features["routeComplexity"] > 5:
        score += 1

    # Large trade
    if features["amount"] > 10:
        score += 1

    # High slippage
    if features["slippage"] > 1.5:
        score += 1

    if score == 0:
        return 0   # LOW

    elif score <= 2:
        return 1   # MEDIUM

    return 2       # HIGH