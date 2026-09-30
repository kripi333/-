/** 1234 → «1 234». Неразрывные пробелы, чтобы цена не переносилась. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE").format(Math.round(value)).replace(/\u00A0|\s/g, "\u202F");
}

/** 290 → «290 €» */
export function formatPrice(value: number): string {
  return `${formatNumber(value)}\u00A0€`;
}

/** «255–265 €» */
export function formatPriceRange(min: number, max: number): string {
  return `${formatNumber(min)}–${formatNumber(max)}\u00A0€`;
}
