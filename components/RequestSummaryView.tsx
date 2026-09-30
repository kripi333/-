"use client";
import { Icon } from "./Icon";
import { useLocale } from "./LocaleProvider";
import { formatNumber, formatPriceRange } from "@/lib/format";
import type { RequestSummary } from "@/lib/requestSummary";
import type { CopyKey } from "@/config/i18n";
import type { MovingType, ServiceKey } from "@/config/pricing";

const typeLabelKeys: Record<MovingType, CopyKey> = {
  apartment: "typeApartment", house: "typeHouse", office: "typeOffice", furniture: "typeFurniture", other: "typeOther",
};

const serviceLabelKeys: Record<ServiceKey, CopyKey> = {
  packing: "servicePacking", materials: "serviceMaterials", disassembly: "serviceDisassembly", assembly: "serviceAssembly",
  bulky: "serviceBulky", appliances: "serviceAppliances", disposal: "serviceDisposal", storage: "serviceStorage",
};

function floorsLine(summary: RequestSummary, t: (key: CopyKey) => string) {
  const floor = (value: number) => (value === 0 ? t("ground") : `${value}`);
  const lift = (value: boolean) => (value ? t("withElevator") : t("withoutElevator"));
  return `${floor(summary.originFloor)} (${lift(summary.originElevator)}) → ${floor(summary.destinationFloor)} (${lift(summary.destinationElevator)})`;
}

export function RequestSummaryView({ summary }: { summary: RequestSummary }) {
  const { t } = useLocale();
  const route = summary.cityFrom || summary.cityTo
    ? `${summary.cityFrom || "—"} → ${summary.cityTo || "—"}`
    : "—";
  const services = summary.services.length > 0
    ? summary.services.map((key) => t(serviceLabelKeys[key])).join(", ")
    : t("noServices");

  const rows: { label: CopyKey; value: string }[] = [
    { label: "summaryType", value: t(typeLabelKeys[summary.movingType]) },
    { label: "summaryRoute", value: route },
    { label: "summaryDistance", value: `${formatNumber(summary.distance)} km` },
    { label: "summaryFloors", value: floorsLine(summary, t) },
    { label: "summaryDate", value: summary.date || t("noDate") },
    { label: "summaryServices", value: services },
  ];

  return (
    <div className="summary-card">
      <div className="summary-price">
        <small>{t("summaryPrice")}</small>
        <strong>{formatPriceRange(summary.min, summary.max)}</strong>
        <span><Icon name="shield" size={15} /> {t("estimateId")}: <b>{summary.id}</b></span>
      </div>
      <dl className="summary-list">
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{t(row.label)}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
