/**
 * Image loader for the static (GitHub Pages) build.
 * There is no image server on static hosting, so scripts/build-images.mjs pre-renders every photo in
 * public/images to WebP at each width Next asks for, and this loader points at those files.
 * Anything else (logos, icons) is served as-is.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Widths Next may request. Keep in sync with images.deviceSizes + imageSizes in next.config.ts. */
export const IMAGE_WIDTHS = [64, 128, 256, 384, 640, 828, 1200, 1920, 2560];

export default function staticImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const m = src.match(/^\/images\/([^/]+)\.(jpe?g|png)$/i);
  if (!m) return `${BASE}${src}`;
  const w = IMAGE_WIDTHS.find((x) => x >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];
  return `${BASE}/images/_w/${m[1]}-${w}.webp`;
}

/** A small, optimised URL for a photo used outside next/image (e.g. as a CSS background). */
export function imageUrl(src: string, width: number) {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1") return staticImageLoader({ src, width });
  return `${BASE}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/** Prefixes a root-relative path with the site's base path (needed on GitHub Pages project sites). */
export const withBase = (path: string) => `${BASE}${path}`;
export const stripBase = (path: string) => (BASE && path.startsWith(BASE) ? path.slice(BASE.length) || "/" : path);
