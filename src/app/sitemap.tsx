import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/assessment`, lastModified: now, priority: 0.9 },
    { url: `${SITE.url}/pricing`, lastModified: now, priority: 0.9 },
    ...SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    { url: `${SITE.url}/contact`, lastModified: now, priority: 0.6 },
    { url: `${SITE.url}/privacy`, lastModified: now, priority: 0.2 },
  ];
}
