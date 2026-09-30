"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/components/LocaleProvider";
import { company } from "@/config/company";

export default function Impressum() {
  const { t } = useLocale();
  return (
    <>
      <Header />
      <main className="legal shell">
        <p className="eyebrow">{t("legal")}</p>
        <h1>{t("imprintTitle")}</h1>
        <p>
          <b>{company.name}</b>
          <br />
          {company.legal.street}
          <br />
          {company.legal.city}
        </p>
        <p>
          <a href={company.phone.href}>{company.phone.display}</a>
          <br />
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
        <p className="fineprint">{t("imprintNote")}</p>
      </main>
      <Footer />
    </>
  );
}
