import type { NextConfig } from "next";

const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Два режима сборки:
 *
 * 1. Обычный (npm run dev / npm run build) — серверные роуты /api/calculate и /api/request.
 * 2. Статическая демо-версия для GitHub Pages (NEXT_PUBLIC_STATIC_DEMO=1):
 *    `output: export`, расчёт цены считается в браузере, форма заявки открывает
 *    почтовый клиент. Собирается скриптом scripts/build-static.mjs.
 *
 * allowedDevOrigins — домены, с которых разрешены dev-ресурсы Next в песочнице превью.
 */
const nextConfig: NextConfig = {
  ...(staticDemo
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: { remotePatterns: [{ protocol: "https" as const, hostname: "images.unsplash.com" }] },
      }),
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
};

export default nextConfig;
