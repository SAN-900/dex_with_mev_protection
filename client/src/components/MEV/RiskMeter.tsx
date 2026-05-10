interface Props {
  risk: {
    risk: number;
    level: string;
  } | null;
}

export default function RiskMeter({ risk }: Props) {
  if (!risk) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      <h4>Risk: {risk.level}</h4>
      <progress value={risk.risk} max={1} style={{ width: "100%" }} />
    </div>
  );
}