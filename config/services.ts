import type { ServiceKey } from "./pricing";

/**
 * Карточки раздела «Наши услуги».
 * href заранее настраивает калькулятор (тип переезда, услуга, дальний переезд),
 * чтобы кнопка «Подробнее» не открывала пустую форму.
 */
export type ServiceCardDef = {
  readonly key: "apartment" | "house" | "office" | "furniture" | "packing" | "longdistance";
  readonly icon: "building" | "truck" | "layers" | "sofa" | "box" | "pin";
  readonly href: string;
};

export const serviceCards: readonly ServiceCardDef[] = [
  { key: "apartment", icon: "building", href: "/calculator?type=apartment" },
  { key: "house", icon: "truck", href: "/calculator?type=house" },
  { key: "office", icon: "layers", href: "/calculator?type=office" },
  { key: "furniture", icon: "sofa", href: "/calculator?type=furniture" },
  { key: "packing", icon: "box", href: "/calculator?type=apartment&service=packing" },
  { key: "longdistance", icon: "pin", href: "/calculator?type=apartment&longDistance=1" },
] as const;

export type ServiceCardKey = ServiceCardDef["key"];

/** Порядок и иконки дополнительных услуг в шаге 5 калькулятора. */
export const serviceOrder: readonly ServiceKey[] = [
  "packing",
  "materials",
  "disassembly",
  "assembly",
  "bulky",
  "appliances",
  "disposal",
  "storage",
];

/** Дистанция, которая подставляется при переходе из карточки «Дальние переезды». */
export const LONG_DISTANCE_DEFAULT = 320;
