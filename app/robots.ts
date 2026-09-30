import type { MetadataRoute } from "next";

/** Статический экспорт (GitHub Pages) требует явно помечать эти роуты статическими. */
export const dynamic = "force-static";
import { company } from "@/config/company";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${company.site}/sitemap.xml` };
}
