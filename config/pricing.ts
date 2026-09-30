export const pricing = {
  minimumOrder: 180,
  base: { apartment: 165, house: 215, office: 280, furniture: 115, other: 150 },
  perSquareMeter: 2.2,
  perKm: 1.05,
  longDistanceThreshold: 80,
  longDistanceMultiplier: 1.18,
  floorFee: 14,
  noElevatorFee: 22,
  /** Дополнительные услуги: только цены. Подписи — в config/i18n (ключи serviceLabels). */
  services: {
    packing: 95,
    materials: 45,
    disassembly: 65,
    assembly: 75,
    bulky: 55,
    appliances: 40,
    disposal: 85,
    storage: 120,
  },
} as const;

export type MovingType = keyof typeof pricing.base;
export type ServiceKey = keyof typeof pricing.services;

export type CalculationInput = {
  movingType: MovingType; area: number; distance: number; originFloor: number;
  destinationFloor: number; originElevator: boolean; destinationElevator: boolean; services: ServiceKey[];
};

export type CalculationResult = {
  min: number; max: number;
  breakdown: { base: number; area: number; distance: number; stairs: number; extras: number };
};

export const movingTypeKeys = Object.keys(pricing.base) as MovingType[];
export const serviceKeys = Object.keys(pricing.services) as ServiceKey[];

/** Границы значений — используются и на клиенте, и на сервере, чтобы не расходились. */
export const limits = {
  area: { min: 1, max: 1000 },
  distance: { min: 0, max: 3000 },
  floor: { min: 0, max: 30 },
} as const;

export function isMovingType(value: unknown): value is MovingType {
  return typeof value === "string" && (movingTypeKeys as string[]).includes(value);
}

export function isServiceKey(value: unknown): value is ServiceKey {
  return typeof value === "string" && (serviceKeys as string[]).includes(value);
}

/** Минимальная цена «Комфорт» в маркетинговых тарифах (шаг наценки 5 €, как в расчёте). */
export function calculateMove(input: CalculationInput): CalculationResult {
  const base = pricing.base[input.movingType];
  const area = input.area * pricing.perSquareMeter;
  let distance = input.distance * pricing.perKm;
  if (input.distance > pricing.longDistanceThreshold) distance *= pricing.longDistanceMultiplier;
  const stairs = (input.originFloor + input.destinationFloor) * pricing.floorFee
    + (!input.originElevator && input.originFloor > 0 ? pricing.noElevatorFee : 0)
    + (!input.destinationElevator && input.destinationFloor > 0 ? pricing.noElevatorFee : 0);
  const extras = input.services.reduce((total, key) => total + pricing.services[key], 0);
  const net = Math.max(pricing.minimumOrder, Math.round(base + area + distance + stairs + extras));
  return { min: Math.round(net * 0.93 / 5) * 5, max: Math.round(net * 1.08 / 5) * 5, breakdown: { base, area: Math.round(area), distance: Math.round(distance), stairs: Math.round(stairs), extras } };
}
