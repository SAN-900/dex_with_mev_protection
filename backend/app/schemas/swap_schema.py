from pydantic import BaseModel

class SwapData(BaseModel):
    amount: float
    slippage: float
    liquidity: float
    priceImpact: float
    routeComplexity: int
    fee: float = 0