"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { useLocale } from "./LocaleProvider";
import { company } from "@/config/company";
import { localeLabels, locales, type Locale } from "@/config/i18n";

export function Header() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();

  const links: [string, string][] = [
    [t("services"), "/#leistungen"],
    [t("prices"), "/#preise"],
    [t("process"), "/#ablauf"],
    [t("faq"), "/#faq"],
    [t("contact"), "/#kontakt"],
  ];

  // Меню закрывается при переходе и по Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header">
      <div className="shell nav">
        <Link className="brand" href="/" aria-label={company.name}>
          <Logo />
        </Link>

        <nav className={open ? "navlinks is-open" : "navlinks"} id="hauptnavigation">
          {links.map(([label, href]) => (
            <Link onClick={() => setOpen(false)} href={href} key={href}>{label}</Link>
          ))}
          <div className="lang-switch" role="group" aria-label={t("language")}>
            {locales.map((code: Locale) => (
              <button
                key={code}
                type="button"
                className={locale === code ? "active" : ""}
                aria-pressed={locale === code}
                onClick={() => setLocale(code)}
              >
                {localeLabels[code]}
              </button>
            ))}
          </div>
          <a className="nav-phone" href={company.phone.href}>{company.phone.display}</a>
          <Link href="/calculator" className="button button-small">
            {t("calculate")} <Icon name="arrow" size={16} />
          </Link>
        </nav>

        <div className="header-actions">
          <a className="header-call" href={company.phone.href} aria-label={t("call")}>
            <Icon name="phone" size={18} />
          </a>
          <button
            className="menu"
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? t("closeMenu") : t("menuOpen")}
            aria-expanded={open}
            aria-controls="hauptnavigation"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
