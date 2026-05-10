import { JupiterQuote } from "./utils";

export const buildRiskFeatures = (quote: JupiterQuote) => {
  const amount = Number(quote.inAmount) / 1e6; // normalize (approx)
  const slippage = quote.slippageBps / 100;
  const priceImpact = Number(quote.priceImpactPct);

  const routeComplexity = quote.routePlan.length;

  return {
    amount,
    slippage,
    liquidity: estimateLiquidity(priceImpact, amount),
    priceImpact,
    routeComplexity
  };
};

// crude liquidity estimation (works for demo)
const estimateLiquidity = (priceImpact: number, amount: number) => {
  if (priceImpact === 0) return 1000000;
  return amount / priceImpact;
};