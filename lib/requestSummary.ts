import type { MovingType, ServiceKey } from "@/config/pricing";

/** Итог расчёта, который показывается на странице заявки. */
export type RequestSummary = {
  movingType: MovingType;
  area: number;
  distance: number;
  originFloor: number;
  destinationFloor: number;
  originElevator: boolean;
  destinationElevator: boolean;
  services: ServiceKey[];
  date: string;
  cityFrom: string;
  cityTo: string;
  min: number;
  max: number;
  id: string;
  createdAt: number;
};

const STORAGE_KEY = "kushch-request-summary";

export function saveRequestSummary(summary: RequestSummary) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
  } catch {
    /* приватный режим: резюме просто не сохранится */
  }
}

export function readRequestSummary(): RequestSummary | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RequestSummary;
    if (typeof parsed?.min !== "number" || typeof parsed?.max !== "number" || typeof parsed?.movingType !== "string") return null;
    return { ...parsed, services: Array.isArray(parsed.services) ? parsed.services : [] };
  } catch {
    return null;
  }
}

export function clearRequestSummary() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ничего страшного */
  }
}
