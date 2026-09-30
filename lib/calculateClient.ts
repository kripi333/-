import { calculateMove, type CalculationInput, type CalculationResult } from "@/config/pricing";
import { staticDemo } from "./runtime";

export type CalculationResponse = CalculationResult & { id: string };

function demoId(): string {
  return `DEMO-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * Одна точка входа для расчёта на клиенте.
 * В обычной сборке — серверный роут /api/calculate.
 * В статической демо-версии — тот же алгоритм из config/pricing прямо в браузере.
 */
export async function requestCalculation(input: CalculationInput): Promise<CalculationResponse> {
  if (staticDemo) {
    return { ...calculateMove(input), id: demoId() };
  }
  const response = await fetch("/api/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("calculation failed");
  return (await response.json()) as CalculationResponse;
}
