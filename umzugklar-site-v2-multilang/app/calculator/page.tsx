"use client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FullCalculator } from "@/components/FullCalculator";
import { useLocale } from "@/components/LocaleProvider";
export default function CalculatorPage() { const {t}=useLocale(); return <><Header/><main className="calculator-page"><div className="shell breadcrumbs"><Link href="/">{t("start")}</Link><span>/</span><span>{t("costCalculator")}</span></div><section className="calculator-hero"><div className="shell"><p className="eyebrow">{t("minutes")}</p><h1>{t("calcHero1")}<br/><em>{t("calcHero2")}</em></h1><p>{t("calcHeroLead")}</p></div></section><section className="shell calculator-section"><FullCalculator/></section><section id="anfrage" className="consult-box"><div className="shell"><div><p className="eyebrow">{t("personal")}</p><h2>{t("advise")}</h2><p>{t("adviseText")}</p></div><div><a href="tel:+493012345678">+49 30 123 45 678</a><a href="https://wa.me/493012345678">{t("whatsapp")}</a></div></div></section></main><Footer/></> }
