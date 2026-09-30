import { isMovingType, isServiceKey, limits, type MovingType, type ServiceKey } from "@/config/pricing";
import { LONG_DISTANCE_DEFAULT } from "@/config/services";

export type CalculatorData = {
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
};

export const initialCalculatorData: CalculatorData = {
  movingType: "apartment",
  area: 45,
  distance: 25,
  originFloor: 1,
  destinationFloor: 2,
  originElevator: true,
  destinationElevator: false,
  services: [],
  date: "",
  cityFrom: "",
  cityTo: "",
};

type RawParams = Record<string, string | string[] | undefined>;

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Разбор ссылок вида /calculator?type=office&service=packing&tariff=comfort.
 * Так карточки услуг и тарифы открывают калькулятор с уже выбранными настройками,
 * а быстрый расчёт на главной переносит введённые данные.
 */
export function parseCalculatorPrefill(params: RawParams): Partial<CalculatorData> {
  const prefill: Partial<CalculatorData> = {};
  const type = single(params.type);
  if (isMovingType(type)) prefill.movingType = type;

  const services = new Set<ServiceKey>();
  const service = single(params.service);
  if (isServiceKey(service)) services.add(service);

  const tariff = single(params.tariff);
  if (tariff === "comfort") {
    services.add("materials");
    services.add("assembly");
  }
  if (services.size > 0) prefill.services = Array.from(services);

  if (single(params.longDistance)) prefill.distance = LONG_DISTANCE_DEFAULT;

  const area = Number(single(params.area));
  if (Number.isFinite(area) && single(params.area) !== undefined) {
    prefill.area = clamp(area, limits.area.min, limits.area.max);
  }

  const distance = Number(single(params.distance));
  if (Number.isFinite(distance) && single(params.distance) !== undefined) {
    prefill.distance = clamp(distance, limits.distance.min, limits.distance.max);
  }

  const from = Number(single(params.from));
  if (Number.isFinite(from) && single(params.from) !== undefined) prefill.originFloor = clamp(Math.round(from), 0, 10);
  const to = Number(single(params.to));
  if (Number.isFinite(to) && single(params.to) !== undefined) prefill.destinationFloor = clamp(Math.round(to), 0, 10);

  const fromLift = single(params.fromLift);
  if (fromLift === "1" || fromLift === "0") prefill.originElevator = fromLift === "1";
  const toLift = single(params.toLift);
  if (toLift === "1" || toLift === "0") prefill.destinationElevator = toLift === "1";

  return prefill;
}
