import { de, type CopyKey } from "./de";
import { en } from "./en";
import { uk } from "./uk";
import { ru } from "./ru";

export const locales = ["de", "en", "uk", "ru"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = { de: "DE", en: "EN", uk: "UA", ru: "RU" };

/**
 * Полные словари. TypeScript проверяет Record<CopyKey, string> при сборке,
 * поэтому «немецкий текст внутри русской версии» больше не пройдёт незамеченным.
 */
export const translations: Record<Locale, Record<CopyKey, string>> = { de, en, uk, ru };

export const LOCALE_COOKIE = "kushch-locale";
export const LOCALE_STORAGE_KEY = "kushch-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Язык браузера → поддерживаемая локаль (uk задаётся раньше ru: uk-UA не должен стать ru). */
export function detectLocale(navigatorLanguage: string | undefined | null): Locale {
  const nav = (navigatorLanguage ?? "").toLowerCase();
  if (nav.startsWith("uk")) return "uk";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("en")) return "en";
  return "de";
}

export function translate(locale: Locale, key: CopyKey): string {
  const value = translations[locale]?.[key] ?? de[key];
  if (process.env.NODE_ENV !== "production" && (!value || typeof value !== "string")) {
    console.warn(`[i18n] отсутствует перевод: ${locale}.${key}`);
  }
  return value;
}

export type { CopyKey };
