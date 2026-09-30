"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon, type IconName } from "./Icon";
import { RequestSummaryView } from "./RequestSummaryView";
import { useLocale } from "./LocaleProvider";
import { company } from "@/config/company";
import { readRequestSummary, type RequestSummary } from "@/lib/requestSummary";
import type { CopyKey } from "@/config/i18n";

type ChannelKey = "telegram" | "instagram" | "viber" | "email" | "phone";

const channels: { key: ChannelKey; label: CopyKey; placeholder: CopyKey; icon: IconName; type: string; autoComplete: string }[] = [
  { key: "telegram", label: "telegram", placeholder: "telegramPlaceholder", icon: "telegram", type: "text", autoComplete: "off" },
  { key: "instagram", label: "instagram", placeholder: "instagramPlaceholder", icon: "instagram", type: "text", autoComplete: "off" },
  { key: "viber", label: "viber", placeholder: "viberPlaceholder", icon: "phone", type: "tel", autoComplete: "tel" },
  { key: "email", label: "email", placeholder: "emailPlaceholder", icon: "mail", type: "email", autoComplete: "email" },
  { key: "phone", label: "phone", placeholder: "phonePlaceholder", icon: "phone", type: "tel", autoComplete: "tel" },
];

const emptyValues: Record<ChannelKey, string> = { telegram: "", instagram: "", viber: "", email: "", phone: "" };
const emptyEnabled: Record<ChannelKey, boolean> = { telegram: false, instagram: false, viber: false, email: false, phone: false };

export function RequestForm() {
  const { t } = useLocale();
  const [summary, setSummary] = useState<RequestSummary | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [values, setValues] = useState<Record<ChannelKey, string>>(emptyValues);
  const [enabled, setEnabled] = useState<Record<ChannelKey, boolean>>(emptyEnabled);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    setSummary(readRequestSummary());
  }, []);

  const contactPairs = useMemo(
    () => channels.filter((channel) => enabled[channel.key] && values[channel.key].trim().length > 0),
    [enabled, values],
  );

  const validate = () => {
    const list: string[] = [];
    if (name.trim().length < 2) list.push(t("errName"));
    if (contactPairs.length === 0) list.push(t("errContact"));
    if (enabled.email && values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) list.push(t("errEmail"));
    if (enabled.phone && values.phone.trim() && values.phone.replace(/[^\d]/g, "").length < 7) list.push(t("errPhone"));
    if (enabled.viber && values.viber.trim() && values.viber.replace(/[^\d]/g, "").length < 7) list.push(t("errPhone"));
    if (!consent) list.push(t("errConsent"));
    return Array.from(new Set(list));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const list = validate();
    setErrors(list);
    if (list.length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contacts: Object.fromEntries(contactPairs.map((channel) => [channel.key, values[channel.key].trim()])),
          message: message.trim(),
          consent,
          locale: document.documentElement.lang,
          summary,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setErrors([t("errGeneric")]);
    }
  };

  if (summary === undefined) {
    return <div className="request-loading" aria-live="polite" />;
  }

  if (summary === null) {
    return (
      <div className="empty-state">
        <Icon name="calculator" size={30} />
        <h2>{t("noSummaryTitle")}</h2>
        <p>{t("noSummaryText")}</p>
        <Link className="button" href="/calculator">{t("goToCalculator")} <Icon name="arrow" size={17} /></Link>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="success-state" role="status">
        <span className="success-icon"><Icon name="check" size={26} /></span>
        <h2>{t("successTitle")}</h2>
        <p>{t("successText")}</p>
        <p className="success-note">{t("successNote")} <b>{summary.id}</b></p>
        <div className="success-actions">
          <a className="button" href={company.phone.href}><Icon name="phone" size={17} /> {company.phone.display}</a>
          <a className="text-link" href={`mailto:${company.email}`}>{company.email}</a>
        </div>
        <p className="fineprint">{t("replyTime")}</p>
      </div>
    );
  }

  return (
    <form className="request-form" onSubmit={submit} noValidate>
      <div className="request-grid">
        <div className="request-fields">
          <label className="field">
            <span className="field-label">{t("nameLabel")}</span>
            <input
              className="field-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              required
            />
          </label>

          <fieldset className="contact-fieldset">
            <legend className="field-label">{t("contactTitle")}</legend>
            <p className="field-hint">{t("contactHint")}</p>
            <div className="contact-chips">
              {channels.map((channel) => (
                <button
                  key={channel.key}
                  type="button"
                  className={enabled[channel.key] ? "contact-chip active" : "contact-chip"}
                  aria-pressed={enabled[channel.key]}
                  onClick={() => setEnabled((current) => ({ ...current, [channel.key]: !current[channel.key] }))}
                >
                  <Icon name={channel.icon} size={17} />
                  {t(channel.label)}
                </button>
              ))}
            </div>

            <div className="contact-fields">
              {channels.map((channel) => {
                if (!enabled[channel.key]) return null;
                return (
                  <label className={`field contact-input contact-${channel.key}`} key={channel.key}>
                    <span className="field-label">{t(channel.label)}</span>
                    <input
                      className="field-input"
                      type={channel.type}
                      inputMode={channel.type === "tel" ? "tel" : undefined}
                      autoComplete={channel.autoComplete}
                      value={values[channel.key]}
                      placeholder={t(channel.placeholder)}
                      onChange={(event) => setValues((current) => ({ ...current, [channel.key]: event.target.value }))}
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="field">
            <span className="field-label">{t("messageLabel")}</span>
            <textarea
              className="field-input"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("messagePlaceholder")}
            />
          </label>

          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>
              {t("consentBefore")} <Link href="/datenschutz">{t("consentLink")}</Link>{t("consentAfter")}
            </span>
          </label>

          {errors.length > 0 && (
            <ul className="form-error" role="alert">
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          )}

          <div className="request-actions">
            <button className="button" type="submit" disabled={status === "sending"}>
              {status === "sending" ? t("sending") : t("submitRequest")} <Icon name="arrow" size={17} />
            </button>
            <a className="text-link" href={company.phone.href}>
              <Icon name="phone" size={16} /> {company.phone.display}
            </a>
          </div>
        </div>

        <aside className="request-summary">
          <p className="eyebrow">{t("summaryTitle")}</p>
          <RequestSummaryView summary={summary} />
        </aside>
      </div>
    </form>
  );
}
