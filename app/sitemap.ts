import type { MetadataRoute } from "next";
import { company } from "@/config/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/calculator", "/anfrage", "/impressum", "/datenschutz"];
  return pages.map((path) => ({
    url: `${company.site}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
