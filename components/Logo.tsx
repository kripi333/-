import { brand } from "@/config/brand";
import { company } from "@/config/company";

/**
 * Логотип Kushch Services.
 *
 * Есть исходный PNG → `npm run logo` собирает файлы в public/brand и включает
 * режим картинок (config/brand.ts). Файла пока нет — знак и вордмарк рисуются кодом,
 * чтобы шапка и футер выглядели законченно.
 */
export function Logo({ light = false, variant = "lockup" }: { light?: boolean; variant?: "lockup" | "mark" }) {
  if (brand.hasLogoImages) {
    const file = variant === "mark" ? `mark-${light ? "light" : "dark"}` : `lockup-${light ? "light" : "dark"}`;
    return (
      <span className={["logo", light ? "logo-light" : ""].filter(Boolean).join(" ")}>
        <img
          className={variant === "mark" ? "logo-img logo-img-mark" : "logo-img"}
          src={`/brand/${file}.png`}
          alt={company.name}
          width={variant === "mark" ? 40 : 200}
          height={variant === "mark" ? 40 : 40}
        />
      </span>
    );
  }

  return (
    <span className={["logo", light ? "logo-light" : ""].filter(Boolean).join(" ")}>
      <span className="logo-mark" aria-hidden>
        <svg viewBox="0 0 32 32" width="22" height="22" role="presentation">
          {/* крыша дома */}
          <path d="M3 16.5 16 5l13 11.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          {/* кузов и кабина грузовика */}
          <path d="M5.5 19h12.5v7.5H5.5z" fill="currentColor" />
          <path d="M18 21h5l3.5 3.5v2H18z" fill="currentColor" />
          <circle cx="9.5" cy="26" r="1.6" fill="#fff" />
          <circle cx="21.5" cy="26" r="1.6" fill="#fff" />
        </svg>
      </span>
      {variant === "lockup" && (
        <span className="logo-text">
          <b>Kushch</b>
          <i>Services</i>
        </span>
      )}
    </span>
  );
}
