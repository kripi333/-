"use client";
import Link from "next/link";
import { use } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FullCalculator } from "@/components/FullCalculator";
import { useLocale } from "@/components/LocaleProvider";
import { company } from "@/config/company";
import { parseCalculatorPrefill } from "@/lib/calculatorPrefill";

export default function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { t } = useLocale();
  const prefill = parseCalculatorPrefill(use(searchParams));

  return (
    <>
      <Header />
      <main className="calculator-page">
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
      </main>
      <Footer />
    </>
  );
}
