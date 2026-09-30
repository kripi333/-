"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { Select, type SelectOption } from "./Select";
import { NumberField } from "./NumberField";
import { useLocale } from "./LocaleProvider";
import { limits, pricing, type CalculationResult, type MovingType, type ServiceKey } from "@/config/pricing";
import { serviceOrder } from "@/config/services";
import { initialCalculatorData, type CalculatorData } from "@/lib/calculatorPrefill";
import { formatNumber, formatPrice, formatPriceRange } from "@/lib/format";
import { saveRequestSummary } from "@/lib/requestSummary";
import type { CopyKey } from "@/config/i18n";

const stepLabelKeys: readonly CopyKey[] = ["calcStep1", "calcStep2", "calcStep3", "calcStep4", "calcStep5", "calcStep6", "calcStep7"];

const typeLabelKeys: Record<MovingType, CopyKey> = {
  apartment: "typeApartment", house: "typeHouse", office: "typeOffice", furniture: "typeFurniture", other: "typeOther",
};

const serviceLabelKeys: Record<ServiceKey, CopyKey> = {
  packing: "servicePacking", materials: "serviceMaterials", disassembly: "serviceDisassembly", assembly: "serviceAssembly",
  bulky: "serviceBulky", appliances: "serviceAppliances", disposal: "serviceDisposal", storage: "serviceStorage",
};

type Result = CalculationResult & { id: string };

const typeIcons: Record<MovingType, "building" | "truck" | "layers" | "sofa" | "box"> = {
  apartment: "building", house: "truck", office: "layers", furniture: "sofa", other: "box",
};

export function FullCalculator({ prefill }: { prefill?: Partial<CalculatorData> }) {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CalculatorData>(() => ({ ...initialCalculatorData, ...prefill }));
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CalculatorData>(key: K, value: CalculatorData[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  const toggleService = (key: ServiceKey) =>
    setData((current) => ({
      ...current,
      services: current.services.includes(key) ? current.services.filter((item) => item !== key) : [...current.services, key],
    }));

  const floorOptions: SelectOption[] = Array.from({ length: 11 }, (_, index) => ({
    value: index,
    label: index === 0 ? t("ground") : String(index),
  }));

  const calculate = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movingType: data.movingType, area: data.area, distance: data.distance,
          originFloor: data.originFloor, destinationFloor: data.destinationFloor,
          originElevator: data.originElevator, destinationElevator: data.destinationElevator,
          services: data.services,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      const payload = (await response.json()) as Result;
      setResult(payload);
      saveRequestSummary({ ...data, min: payload.min, max: payload.max, id: payload.id, createdAt: Date.now() });
    } catch {
      setError(t("calcError"));
    } finally {
      setBusy(false);
    }
  };

  const canNext = (step !== 2 || data.area > 0) && (step !== 3 || data.distance >= 0);

  return (
    <div className="full-calculator">
      <ol className="stepper">
        {stepLabelKeys.map((key, index) => {
          const number = index + 1;
          return (
            <li className={number === step ? "active" : number < step ? "done" : ""} key={key}>
              <i>{number < step ? <Icon name="check" size={13} /> : number}</i>
              <span>{t(key)}</span>
            </li>
          );
        })}
      </ol>

      <div className="step-content">
        {step === 1 && (
          <>
            <p className="eyebrow">{t("step")} 1 / 7</p>
            <h2>{t("s1")}</h2>
            <p className="subcopy">{t("s1p")}</p>
            <div className="type-grid">
              {(Object.keys(typeIcons) as MovingType[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={data.movingType === key ? "type-card selected" : "type-card"}
                  aria-pressed={data.movingType === key}
                  onClick={() => update("movingType", key)}
                >
                  <Icon name={typeIcons[key]} size={29} />
                  <span>{t(typeLabelKeys[key])}</span>
                  <i><Icon name="check" size={13} /></i>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="eyebrow">{t("step")} 2 / 7</p>
            <h2>{t("s2")}</h2>
            <p className="subcopy">{t("s2p")}</p>
            <div className="range-row">
              <input
                aria-label={t("area")}
                type="range"
                min={10}
                max={200}
                step={5}
                value={data.area}
                style={{ "--progress": `${((Math.min(200, Math.max(10, data.area)) - 10) / 190) * 100}%` } as React.CSSProperties}
                onChange={(event) => update("area", Number(event.target.value))}
              />
              <strong>{data.area} <small>m²</small></strong>
            </div>
            <div className="range-label"><span>{t("small")}</span><span>{t("large")}</span></div>
            <div className="range-exact">
              <NumberField
                value={data.area}
                onChange={(value) => update("area", value)}
                min={limits.area.min}
                max={limits.area.max}
                step={5}
                suffix="m²"
                label={t("area")}
                decreaseLabel={t("decrease")}
                increaseLabel={t("increase")}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="eyebrow">{t("step")} 3 / 7</p>
            <h2>{t("s3")}</h2>
            <p className="subcopy">{t("s3p")}</p>
            <div className="route-grid">
              <label>
                {t("from")}
                <input placeholder={t("example1")} value={data.cityFrom} onChange={(event) => update("cityFrom", event.target.value)} />
              </label>
              <label>
                {t("to")}
                <input placeholder={t("example2")} value={data.cityTo} onChange={(event) => update("cityTo", event.target.value)} />
              </label>
              <div className="route-distance">
                <span className="field-label">{t("distance")}</span>
                <NumberField
                  value={data.distance}
                  onChange={(value) => update("distance", value)}
                  min={limits.distance.min}
                  max={limits.distance.max}
                  step={5}
                  suffix="km"
                  label={t("distance")}
                  decreaseLabel={t("decrease")}
                  increaseLabel={t("increase")}
                />
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="eyebrow">{t("step")} 4 / 7</p>
            <h2>{t("s4")}</h2>
            <p className="subcopy">{t("s4p")}</p>
            <div className="floor-grid">
              {([
                { label: t("origin"), floor: "originFloor", lift: "originElevator" },
                { label: t("destination"), floor: "destinationFloor", lift: "destinationElevator" },
              ] as const).map((item) => (
                <div className="floor-card" key={item.floor}>
                  <h3>{item.label}</h3>
                  <span className="field-label">{t("floor")}</span>
                  <Select
                    label={t("floor")}
                    value={data[item.floor]}
                    options={floorOptions}
                    onChange={(value) => update(item.floor, Number(value))}
                  />
                  <button
                    type="button"
                    className={data[item.lift] ? "lift-choice active" : "lift-choice"}
                    aria-pressed={data[item.lift]}
                    onClick={() => update(item.lift, !data[item.lift])}
                  >
                    {t("elevator")} <span>{data[item.lift] ? t("yes") : t("no")}</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <p className="eyebrow">{t("step")} 5 / 7</p>
            <h2>{t("s5")}</h2>
            <p className="subcopy">{t("s5p")}</p>
            <div className="service-list">
              {serviceOrder.map((key) => {
                const checked = data.services.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleService(key)}
                    className={checked ? "service-check checked" : "service-check"}
                  >
                    <i>{checked && <Icon name="check" size={15} />}</i>
                    <span>{t(serviceLabelKeys[key])}</span>
                    <small>+{formatNumber(pricing.services[key])}&nbsp;€</small>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <p className="eyebrow">{t("step")} 6 / 7</p>
            <h2>{t("s6")}</h2>
            <p className="subcopy">{t("s6p")}</p>
            <div className="date-choice">
              <label>
                {t("date")}
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={data.date}
                  onChange={(event) => update("date", event.target.value)}
                />
              </label>
              <button type="button" onClick={() => update("date", "")} className={!data.date ? "selected-date" : ""}>
                {t("open")}
              </button>
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <p className="eyebrow">{t("s7")}</p>
            <h2>{t("summary")}</h2>
            {!result ? (
              <div className="ready-to-calc">
                <Icon name="shield" size={28} />
                <p>{t("calcText")}</p>
                <button className="button" type="button" onClick={calculate} disabled={busy}>
                  {busy ? t("calc") : t("show")} <Icon name="arrow" size={17} />
                </button>
                {error && <p className="form-error" role="alert">{error}</p>}
              </div>
            ) : (
              <div className="price-result">
                <div>
                  <small>{t("range")}</small>
                  <strong>{formatPriceRange(result.min, result.max)}</strong>
                  <p>{t("estimateId")}: <b>{result.id}</b></p>
                </div>
                <dl>
                  <div><dt>{t("base")}</dt><dd>{formatPrice(result.breakdown.base)}</dd></div>
                  <div><dt>{t("sizeRoute")}</dt><dd>{formatPrice(result.breakdown.area + result.breakdown.distance)}</dd></div>
                  <div><dt>{t("floorsExtras")}</dt><dd>{formatPrice(result.breakdown.stairs + result.breakdown.extras)}</dd></div>
                </dl>
                <p className="fineprint">{t("fine")}</p>
                <Link className="button" href="/anfrage">
                  {t("send")} <Icon name="arrow" size={17} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <div className="step-nav">
        <button className="back" type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
          {t("back")}
        </button>
        {step < 7 && (
          <button className="button" type="button" onClick={() => setStep((current) => current + 1)} disabled={!canNext}>
            {t("next")} <Icon name="arrow" size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
