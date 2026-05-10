export interface SwapData {
  amount: number;
  slippage: number;
  liquidity: number;
}

export interface RiskResponse {
  risk: number;
  level: "LOW" | "MEDIUM" | "HIGH";
}

export const getRisk = async (data: SwapData): Promise<RiskResponse> => {
  const res = await fetch("http://127.0.0.1:8000/predict-risk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch risk");
  }

  return res.json();
};