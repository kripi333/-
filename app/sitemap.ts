import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/calculator", "/impressum", "/datenschutz"];
  return pages.map((path) => ({ url: `https://umzugklar.de${path}`, lastModified: new Date(), changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
