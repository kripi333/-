"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocale } from "@/components/LocaleProvider";
import { company } from "@/config/company";

export default function Datenschutz() {
  const { t } = useLocale();
  return (
    <>
      <Header />
      <main className="legal shell">
        <p className="eyebrow">{t("legal")}</p>
        <h1>{t("dataTitle")}</h1>
        <h2>{t("dataCapture")}</h2>
        <p>{t("dataCaptureText")}</p>
        <h2>{t("rights")}</h2>
        <p>
          {t("rightsText")} <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
        <p className="fineprint">{t("privacyNote")}</p>
      </main>
      <Footer />
    </>
  );
}
