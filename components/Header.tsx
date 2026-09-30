"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { useLocale, type Locale } from "./LocaleProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const links = [[t("services"), "#leistungen"], [t("prices"), "#preise"], [t("process"), "#ablauf"], [t("faq"), "#faq"], [t("contact"), "#kontakt"]];
  const langs:{code:Locale;label:string}[]=[{code:"de",label:"DE"},{code:"en",label:"EN"},{code:"uk",label:"UA"},{code:"ru",label:"RU"}];
  return <header className="header"><div className="shell nav"><Link className="brand" href="/"><span className="brand-mark"><Icon name="truck" size={20}/></span><span>umzug<span>klar</span></span></Link><nav className={open ? "navlinks is-open" : "navlinks"}>{links.map(([label, href]) => <a onClick={() => setOpen(false)} href={href} key={href}>{label}</a>)}<div className="lang-switch" aria-label="Language">{langs.map(l=><button key={l.code} className={locale===l.code?"active":""} onClick={()=>setLocale(l.code)} type="button">{l.label}</button>)}</div><a className="nav-phone" href="tel:+493012345678">+49 30 123 45 678</a><Link href="/calculator" className="button button-small">{t("calculate")} <Icon name="arrow" size={16}/></Link></nav><button className="menu" onClick={() => setOpen(!open)} aria-label={t("menuOpen")}> <Icon name={open ? "close" : "menu"}/> </button></div></header>;
}
