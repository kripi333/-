"use client";
import Link from "next/link";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { useLocale } from "./LocaleProvider";
import { company } from "@/config/company";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer id="kontakt" className="footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand brand-light" href="/" aria-label={company.name}>
            <Logo light />
          </Link>
          <p>
            {t("footerTag").split("\n").map((line, index) => (
              <span key={line}>{line}{index === 0 && <br />}</span>
            ))}
          </p>
        </div>

        <div>
          <h3>{t("contact")}</h3>
          <a href={company.phone.href}>{company.phone.display}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <p>{company.hours}</p>
        </div>

        <div>
          <h3>{t("quickAccess")}</h3>
          <a href="/#leistungen">{t("services")}</a>
          <a href="/#preise">{t("prices")}</a>
          <Link href="/calculator">{t("calculate")}</Link>
          <a href="/#faq">FAQ</a>
        </div>

        <div>
          <h3>{t("hereForYou")}</h3>
          <p>
            {t("berlinArea").split("\n").map((line, index) => (
              <span key={line}>{line}{index === 0 && <br />}</span>
            ))}
          </p>
          <a className="social-link" href={company.telegram} target="_blank" rel="noreferrer">
            Telegram <Icon name="arrow" size={15} />
          </a>
          <a className="social-link" href={company.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp <Icon name="arrow" size={15} />
          </a>
        </div>
      </div>

      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {company.name}</span>
        <span>
          <Link href="/impressum">{t("imprint")}</Link>
          <Link href="/datenschutz">{t("privacy")}</Link>
        </span>
      </div>
    </footer>
  );
}
