import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/lib/site";

export const dynamic = "force-static";

// the static (GitHub Pages) build serves folder URLs, so list them with the trailing slash it redirects to
const slash = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ? "/" : "";
const url = (path: string) => `${SITE.url}${path}${slash}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: url("/assessment"), lastModified: now, priority: 0.9 },
    { url: url("/pricing"), lastModified: now, priority: 0.9 },
    ...SERVICES.map((s) => ({ url: url(`/services/${s.slug}`), lastModified: now, priority: 0.8 })),
    { url: url("/contact"), lastModified: now, priority: 0.6 },
    { url: url("/privacy"), lastModified: now, priority: 0.2 },
  ];
}
