"use client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RequestForm } from "@/components/RequestForm";
import { useLocale } from "@/components/LocaleProvider";

export default function RequestPage() {
  const { t } = useLocale();
  return (
    <>
      <Header />
      <main className="request-page">
        <div className="shell breadcrumbs">
          <Link href="/">{t("start")}</Link>
          <span>/</span>
          <Link href="/calculator">{t("costCalculator")}</Link>
          <span>/</span>
          <span>{t("requestEyebrow")}</span>
        </div>
        <section className="request-hero">
          <div className="shell">
            <p className="eyebrow">{t("requestEyebrow")}</p>
            <h1>{t("requestTitle1")}<br /><em>{t("requestTitle2")}</em></h1>
            <p>{t("requestLead")}</p>
          </div>
        </section>
        <section className="shell request-section">
          <RequestForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
