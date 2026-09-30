"use client";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { Icon, type IconName } from "@/components/Icon";
import { QuickCalculator } from "@/components/QuickCalculator";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/components/LocaleProvider";
import { serviceCards, type ServiceCardKey } from "@/config/services";
import { hourlyRates, tariffs, type TariffKey } from "@/config/tariffs";
import { company } from "@/config/company";
import { formatNumber } from "@/lib/format";
import type { CopyKey } from "@/config/i18n";

const serviceCopy: Record<ServiceCardKey, { name: CopyKey; text: CopyKey }> = {
  apartment: { name: "svcApartmentName", text: "svcApartmentText" },
  house: { name: "svcHouseName", text: "svcHouseText" },
  office: { name: "svcOfficeName", text: "svcOfficeText" },
  furniture: { name: "svcFurnitureName", text: "svcFurnitureText" },
  packing: { name: "svcPackingName", text: "svcPackingText" },
  longdistance: { name: "svcLongName", text: "svcLongText" },
};

const stepKeys: { title: CopyKey; text: CopyKey }[] = [
  { title: "step1Title", text: "step1Text" },
  { title: "step2Title", text: "step2Text" },
  { title: "step3Title", text: "step3Text" },
  { title: "step4Title", text: "step4Text" },
];

const tariffCopy: Record<TariffKey, { name: CopyKey; tagline: CopyKey; features: CopyKey[]; cta: CopyKey }> = {
  mini: {
    name: "planMiniName", tagline: "planMiniTagline", cta: "planMiniCta",
    features: ["planMiniFeature1", "planMiniFeature2", "planMiniFeature3"],
  },
  comfort: {
    name: "planComfortName", tagline: "planComfortTagline", cta: "planComfortCta",
    features: ["planComfortFeature1", "planComfortFeature2", "planComfortFeature3"],
  },
  individual: {
    name: "planIndividualName", tagline: "planIndividualTagline", cta: "planIndividualCta",
    features: ["planIndividualFeature1", "planIndividualFeature2", "planIndividualFeature3"],
  },
};

const benefitKeys: { icon: IconName; title: CopyKey; text: CopyKey }[] = [
  { icon: "layers", title: "planFits", text: "planFitsText" },
  { icon: "shield", title: "care", text: "careText" },
  { icon: "clock", title: "reachable", text: "reachableText" },
];

const caseKeys: { name: CopyKey; meta: CopyKey; image: string }[] = [
  { name: "case1Name", meta: "case1Meta", image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80" },
  { name: "case2Name", meta: "case2Meta", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80" },
  { name: "case3Name", meta: "case3Meta", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" },
];

const faqKeys: { q: CopyKey; a: CopyKey }[] = [
  { q: "faq1Q", a: "faq1A" },
  { q: "faq2Q", a: "faq2A" },
  { q: "faq3Q", a: "faq3A" },
  { q: "faq4Q", a: "faq4A" },
];

export default function Home() {
  const { t } = useLocale();

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{t("homeEyebrow")}</p>
              <h1>{t("heroTitle1")}<br /><em>{t("heroTitle2")}</em></h1>
              <p className="lead">{t("heroLead")}</p>
              <div className="hero-actions">
                <Link className="button" href="/calculator">
                  {t("calculate")} <Icon name="arrow" size={18} />
                </Link>
                <a className="text-link" href="#kontakt">
                  {t("consultation")} <Icon name="arrow" size={16} />
                </a>
              </div>
              <div className="trust-row">
                <span><Icon name="clock" size={19} /> {t("sameDay")}</span>
                <span><Icon name="shield" size={19} /> {t("transparent")}</span>
              </div>
            </div>

            <div className="hero-art">
              <div className="hero-image" role="img" aria-label={`${company.name} — ${t("heroTitle1")}`} />
              <div className="hero-note">
                <span className="round-icon"><Icon name="check" size={17} /></span>
                <div><b>{t("allInView")}</b><small>{t("planToBuild")}</small></div>
              </div>
              <div className="hero-chip">
                <Icon name="truck" size={20} />
                <span>
                  {t("teamReady").split("\n").map((line, index) => (
                    <span key={line}>{line}{index === 0 && <br />}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </section>

        <QuickCalculator />

        <section className="section advantage">
          <div className="shell">
            <div className="section-heading centered">
              <p className="eyebrow">{t("countOn")}</p>
              <h2>{t("calmer1")}<br />{t("calmer2")}</h2>
            </div>
            <div className="benefit-grid">
              {benefitKeys.map((item, index) => (
                <Reveal as="article" delay={index * 70} key={item.title}>
                  <span><Icon name={item.icon} /></span>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.text)}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="leistungen" className="section services">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t("ourServices")}</p>
                <h2>{t("helpNeed1")}<br />{t("helpNeed2")}</h2>
              </div>
              <p>{t("serviceIntro")}</p>
            </div>
            <div className="services-grid">
              {serviceCards.map((card, index) => (
                <Reveal as="article" className="service-card" delay={(index % 3) * 70} key={card.key}>
                  <span className="service-icon"><Icon name={card.icon} /></span>
                  <h3>{t(serviceCopy[card.key].name)}</h3>
                  <p>{t(serviceCopy[card.key].text)}</p>
                  <Link href={card.href}>
                    {t("more")} <Icon name="arrow" size={16} />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="ablauf" className="section process">
          <div className="shell process-grid">
            <div>
              <p className="eyebrow">{t("easy")}</p>
              <h2>{t("fourSteps1")}<br />{t("fourSteps2")}</h2>
              <Link href="/calculator" className="button button-white">
                {t("calculate")} <Icon name="arrow" size={17} />
              </Link>
            </div>
            <ol>
              {stepKeys.map((item, index) => (
                <Reveal as="li" delay={index * 60} key={item.title}>
                  <b>{index + 1}</b>
                  <div>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.text)}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section id="preise" className="section pricing">
          <div className="shell">
            <div className="section-heading centered">
              <p className="eyebrow">{t("orientation")}</p>
              <h2>{t("pricingTitle")}</h2>
            </div>

            <div className="tariff-grid">
              {tariffs.map((tariff, index) => {
                const copy = tariffCopy[tariff.key];
                return (
                  <Reveal
                    as="article"
                    className={["tariff-card", `tariff-${tariff.key}`, tariff.featured ? "is-featured" : ""].filter(Boolean).join(" ")}
                    delay={index * 80}
                    key={tariff.key}
                  >
                    {tariff.featured && <span className="tariff-badge">{t("popular")}</span>}
                    <h3>{t(copy.name)}</h3>
                    <p className="tariff-tagline">{t(copy.tagline)}</p>
                    <p className="tariff-price">
                      {tariff.from === null
                        ? <span className="tariff-price-custom">{t("priceOnRequest")}</span>
                        : <><small>{t("priceFrom")}</small> <b>{formatNumber(tariff.from)}&nbsp;€</b></>}
                    </p>
                    <ul className="tariff-list">
                      {copy.features.map((feature) => (
                        <li key={feature}><Icon name="check" size={16} /><span>{t(feature)}</span></li>
                      ))}
                    </ul>
                    <Link className="button tariff-cta" href={tariff.href}>
                      {t(copy.cta)} <Icon name="arrow" size={16} />
                    </Link>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="hourly">
              <h3>{t("hourlyTitle")}</h3>
              <ul className="hourly-list">
                {hourlyRates.map((rate) => (
                  <li className="hourly-item" key={rate.key}>
                    <span>{t(rate.key === "movers" ? "hourlyMovers" : "hourlyVanDriver")}</span>
                    <b>{t("priceFrom")} {formatNumber(rate.price)}&nbsp;€</b>
                    <small>{t("perHour")}</small>
                  </li>
                ))}
              </ul>
              <p>{t("hourlyNote")}</p>
            </Reveal>
            <p className="pricing-note">{t("pricingNote")}</p>
          </div>
        </section>

        <section className="section portfolio">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t("workInsights")}</p>
                <h2>{t("arrived1")}<br />{t("arrived2")}</h2>
              </div>
              <p>{t("casesIntro")}</p>
            </div>
            <div className="case-grid">
              {caseKeys.map((item, index) => (
                <Reveal as="article" className="case-card" delay={index * 70} key={item.name}>
                  <img src={item.image} alt="" loading="lazy" />
                  <div>
                    <h3>{t(item.name)}</h3>
                    <p>{t(item.meta)}</p>
                    <a href="#kontakt">{t("project")} <Icon name="arrow" size={16} /></a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section area">
          <div className="shell area-box">
            <div>
              <p className="eyebrow">{t("where")}</p>
              <h2>{t("areaTitle1")}<br />{t("areaTitle2")}</h2>
              <p>{t("areaText")}</p>
              <a href="#kontakt" className="text-link">{t("askArea")} <Icon name="arrow" size={16} /></a>
            </div>
            <div className="map-art">
              <span className="map-dot dot-1" />
              <span className="map-dot dot-2" />
              <span className="map-dot dot-3" />
              <span className="route-line" />
              <b>{t("mapLabel")}</b>
              <small>{t("nextStep")}</small>
            </div>
          </div>
        </section>

        <section id="faq" className="section faq">
          <div className="shell faq-grid">
            <div>
              <p className="eyebrow">{t("commonQuestions")}</p>
              <h2>{t("questions1")}<br />{t("questions2")}</h2>
              <p>{t("notThere")}</p>
              <a className="text-link" href={company.phone.href}>{company.phone.display} <Icon name="arrow" size={16} /></a>
            </div>
            <div>
              {faqKeys.map((item) => (
                <details key={item.q}>
                  <summary>{t(item.q)}<Icon name="arrow" size={18} /></summary>
                  <p>{t(item.a)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="shell">
            <p className="eyebrow">{t("clickStart")}</p>
            <h2>{t("easier1")}<br />{t("easier2")}</h2>
            <Link href="/calculator" className="button button-white">
              {t("calculate")} <Icon name="arrow" size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
