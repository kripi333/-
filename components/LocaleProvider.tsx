"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  detectLocale, isLocale, LOCALE_COOKIE, LOCALE_STORAGE_KEY, translate,
  type CopyKey, type Locale,
} from "@/config/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: CopyKey) => string;
};

const Ctx = createContext<LocaleContextValue>({
  locale: "de",
  setLocale: () => {},
  t: (key) => translate("de", key),
});

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Первый визит: языка в cookie нет — берём язык браузера.
  // Дальше выбор пользователя хранится в cookie и localStorage и не перебивается.
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) {
      setLocaleState((current) => (current === stored ? current : stored));
      return;
    }
    if (document.cookie.includes(`${LOCALE_COOKIE}=`)) return;
    const detected = detectLocale(navigator.language);
    setLocaleState((current) => (current === detected ? current : detected));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* приватный режим — выбор языка просто не сохранится */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: (key: CopyKey) => translate(locale, key) }),
    [locale, setLocale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLocale = () => useContext(Ctx);
export type { Locale };
