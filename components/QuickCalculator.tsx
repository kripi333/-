"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { NumberField } from "./NumberField";
import { Select, type SelectOption } from "./Select";
import { useLocale } from "./LocaleProvider";
import { limits, type CalculationResult } from "@/config/pricing";
import { formatPriceRange } from "@/lib/format";
import { saveRequestSummary } from "@/lib/requestSummary";

type Result = CalculationResult & { id: string };

export function QuickCalculator() {
  const { t } = useLocale();
  const [area, setArea] = useState(45);
  const [distance, setDistance] = useState(25);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(2);
  const [fromLift, setFromLift] = useState(true);
  const [toLift, setToLift] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const floorOptions: SelectOption[] = Array.from({ length: 11 }, (_, index) => ({
    value: index,
    label: index === 0 ? t("ground") : String(index),
  }));

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movingType: "apartment", area, distance, originFloor: from, destinationFloor: to,
          originElevator: fromLift, destinationElevator: toLift, services: [],
        }),
      });
      if (!response.ok) throw new Error("request failed");
      const payload = (await response.json()) as Result;
      setResult(payload);
      saveRequestSummary({
        movingType: "apartment", area, distance, originFloor: from, destinationFloor: to,
        originElevator: fromLift, destinationElevator: toLift, services: [], date: "", cityFrom: "", cityTo: "",
        min: payload.min, max: payload.max, id: payload.id, createdAt: Date.now(),
      });
    } catch {
      setError(t("calcError"));
    } finally {
      setLoading(false);
    }
  }

  const detailsHref = `/calculator?type=apartment&area=${area}&distance=${distance}&from=${from}&to=${to}&fromLift=${fromLift ? 1 : 0}&toLift=${toLift ? 1 : 0}`;

  return (
    <section id="rechner" className="quick-wrap">
      <div className="shell">
        <div className="calculator-card">
          <div className="calc-title">
            <p className="eyebrow">{t("quickCalc")}</p>
            <h2>{t("whatCost")}</h2>
            <p>{t("quickLead")}</p>
          </div>

          <div className="calc-fields">
            <div className="calc-field">
              <span className="field-label">{t("area")}</span>
              <NumberField
                value={area}
                onChange={setArea}
                min={limits.area.min}
                max={limits.area.max}
                step={5}
                suffix="m²"
                label={t("area")}
                decreaseLabel={t("decrease")}
                increaseLabel={t("increase")}
              />
            </div>

            <div className="calc-field">
              <span className="field-label">{t("distance")}</span>
              <NumberField
                value={distance}
                onChange={setDistance}
                min={limits.distance.min}
                max={limits.distance.max}
                step={5}
                suffix="km"
                label={t("distance")}
                decreaseLabel={t("decrease")}
                increaseLabel={t("increase")}
              />
            </div>

            <div className="calc-field">
              <span className="field-label">{t("originFloor")}</span>
              <div className="calc-field-row">
                <Select label={t("originFloor")} value={from} options={floorOptions} onChange={(value) => setFrom(Number(value))} compact />
                <button type="button" className={fromLift ? "toggle on" : "toggle"} aria-pressed={fromLift} onClick={() => setFromLift((current) => !current)}>
                  {t("elevator")}
                </button>
              </div>
            </div>

            <div className="calc-field">
              <span className="field-label">{t("destinationFloor")}</span>
              <div className="calc-field-row">
                <Select label={t("destinationFloor")} value={to} options={floorOptions} onChange={(value) => setTo(Number(value))} compact />
                <button type="button" className={toLift ? "toggle on" : "toggle"} aria-pressed={toLift} onClick={() => setToLift((current) => !current)}>
                  {t("elevator")}
                </button>
              </div>
            </div>
          </div>

          <div className="calc-action">
            <button className="button" type="button" onClick={submit} disabled={loading}>
              {loading ? t("calculating") : t("priceCalc")}
            </button>
            {result && (
              <div className="quick-result">
                <small>{t("estimate")}</small>
                <strong>{formatPriceRange(result.min, result.max)}</strong>
                <Link href={detailsHref}>{t("addDetails")}</Link>
              </div>
            )}
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
