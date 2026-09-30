import { company } from "@/config/company";

/**
 * Логотип Kushch Services.
 * Геометрический знак + плотный вордмарк. Если появится официальный файл —
 * достаточно положить его в public/logo.svg и заменить <span className="logo-mark"> на <img>.
 */
export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  const [first, ...rest] = company.name.split(" ");
  return (
    <span className={["logo", light ? "logo-light" : "", compact ? "logo-compact" : ""].filter(Boolean).join(" ")}>
      <span className="logo-mark" aria-hidden>
        <svg viewBox="0 0 32 32" width="22" height="22" role="presentation">
          <path d="M6 24V8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="m10.5 16.5 8-8.5M12 15.5l8 8.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M25 12v8m0 0-3-3m3 3 3-3" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".85" />
        </svg>
      </span>
      <span className="logo-text">
        <b>{first}</b>
        {rest.length > 0 && <i>{rest.join(" ")}</i>}
      </span>
    </span>
  );
}
