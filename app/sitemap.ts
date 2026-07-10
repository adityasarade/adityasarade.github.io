import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://adityasarade.github.io";
  return [
    { url: `${base}/`, lastModified: new Date("2026-07-10"), priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${base}/work/${c.slug}/`,
      lastModified: new Date("2026-07-10"),
      priority: 0.8,
    })),
  ];
}
