export const pricing = {
  minimumOrder: 180,
  base: { apartment: 165, house: 215, office: 280, furniture: 115, other: 150 },
  perSquareMeter: 2.2,
  perKm: 1.05,
  longDistanceThreshold: 80,
  longDistanceMultiplier: 1.18,
  floorFee: 14,
  noElevatorFee: 22,
  services: {
    packing: { label: "Einpackservice", price: 95 },
    materials: { label: "Verpackungsmaterial", price: 45 },
    disassembly: { label: "Möbel demontieren", price: 65 },
    assembly: { label: "Möbel montieren", price: 75 },
    bulky: { label: "Großmöbel", price: 55 },
    appliances: { label: "Elektrogeräte", price: 40 },
    disposal: { label: "Entsorgung", price: 85 },
    storage: { label: "Zwischenlagerung", price: 120 },
  },
} as const;

export type MovingType = keyof typeof pricing.base;
export type ServiceKey = keyof typeof pricing.services;

export type CalculationInput = {
  movingType: MovingType; area: number; distance: number; originFloor: number;
  destinationFloor: number; originElevator: boolean; destinationElevator: boolean; services: ServiceKey[];
};

export function calculateMove(input: CalculationInput) {
  const base = pricing.base[input.movingType];
  const area = input.area * pricing.perSquareMeter;
  let distance = input.distance * pricing.perKm;
  if (input.distance > pricing.longDistanceThreshold) distance *= pricing.longDistanceMultiplier;
  const stairs = (input.originFloor + input.destinationFloor) * pricing.floorFee
    + (!input.originElevator && input.originFloor > 0 ? pricing.noElevatorFee : 0)
    + (!input.destinationElevator && input.destinationFloor > 0 ? pricing.noElevatorFee : 0);
  const extras = input.services.reduce((total, key) => total + pricing.services[key].price, 0);
  const net = Math.max(pricing.minimumOrder, Math.round(base + area + distance + stairs + extras));
  return { min: Math.round(net * 0.93 / 5) * 5, max: Math.round(net * 1.08 / 5) * 5, breakdown: { base, area: Math.round(area), distance: Math.round(distance), stairs: Math.round(stairs), extras } };
}
