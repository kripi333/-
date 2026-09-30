"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FullCalculator } from "@/components/FullCalculator";
import { useLocale } from "@/components/LocaleProvider";
import { company } from "@/config/company";
import { parseCalculatorPrefill } from "@/lib/calculatorPrefill";

function CalculatorContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => { raw[key] = value; });
  const prefill = parseCalculatorPrefill(raw);

  return (
    <>
      <div className="shell breadcrumbs">
        <Link href="/">{t("start")}</Link>
        <span>/</span>
        <span>{t("costCalculator")}</span>
      </div>
      <section className="calculator-hero">
        <div className="shell">
          <p className="eyebrow">{t("minutes")}</p>
          <h1>{t("calcHero1")}<br /><em>{t("calcHero2")}</em></h1>
          <p>{t("calcHeroLead")}</p>
        </div>
      </section>
      <section className="shell calculator-section">
        <FullCalculator prefill={prefill} />
      </section>
      <section id="anfrage" className="consult-box">
        <div className="shell">
          <div>
            <p className="eyebrow">{t("personal")}</p>
            <h2>{t("advise")}</h2>
            <p>{t("adviseText")}</p>
          </div>
          <div>
            <a href={company.phone.href}>{company.phone.display}</a>
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <a className="consult-whatsapp" href={company.telegram} target="_blank" rel="noreferrer">{t("whatsapp")}</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CalculatorPage() {
  return (
    <>
      <Header />
      <main className="calculator-page">
        <Suspense fallback={<div className="shell calculator-section"><div className="calculator-skeleton" /></div>}>
          <CalculatorContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
