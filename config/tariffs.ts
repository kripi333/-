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

/**
 * Отдельные услуги по часам — раньше это были две карточки в блоке цен.
 * Оставляем их как дополнение к трём тарифам, чтобы ничего не потерялось.
 */
export type HourlyRateKey = "movers" | "vanDriver";

export const hourlyRates: readonly { key: HourlyRateKey; price: number }[] = [
  { key: "movers", price: 39 },
  { key: "vanDriver", price: 79 },
] as const;
