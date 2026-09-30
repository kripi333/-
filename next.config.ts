import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  /**
   * Домены, с которых разрешены dev-ресурсы Next (HMR, чанки) при разработке.
   * Нужно для превью на *.e2b.app: без этого браузер блокирует клиентские
   * ресурсы и перестают работать калькулятор, выпадающие списки и переключатель языка.
   * На production-сборку не влияет.
   */
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
};

export default nextConfig;
