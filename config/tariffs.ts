/**
 * Три тарифа в блоке цен на главной.
 *
 * mini / comfort — ориентировочные пакеты «от», которые объясняют,
 * с какого уровня начинается перевозка. Индивидуальный тариф ведёт
 * в калькулятор: цена считается по расстоянию, объёму, этажам и услугам,
 * поэтому клиент не платит за усреднённый пакет.
 */
export type TariffKey = "mini" | "comfort" | "individual";

export type Tariff = {
  readonly key: TariffKey;
  /** Стартовая цена в евро. У индивидуального тарифа цены нет — считается калькулятором. */
  readonly from: number | null;
  readonly href: string;
  readonly featured?: boolean;
};

export const tariffs: readonly Tariff[] = [
  { key: "mini", from: 290, href: "/calculator?type=furniture&tariff=mini" },
  { key: "comfort", from: 490, href: "/calculator?type=apartment&tariff=comfort" },
  { key: "individual", from: null, href: "/calculator?tariff=individual", featured: true },
] as const;
