"use client";
import Link from "next/link";
import { Icon } from "./Icon";
import { useLocale } from "./LocaleProvider";
import { company } from "@/config/company";

export function MobileBar() {
  const { t } = useLocale();
  return (
    <div className="mobile-bar">
      <a href={company.phone.href}>
        <Icon name="phone" size={19} />
        {t("call")}
      </a>
      <a href={company.whatsapp} target="_blank" rel="noreferrer">
        <Icon name="telegram" size={19} />
        WhatsApp
      </a>
      <Link href="/calculator">
        <Icon name="calculator" size={19} />
        {t("calculator")}
      </Link>
    </div>
  );
}
