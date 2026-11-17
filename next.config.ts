import type { NextConfig } from "next";

/**
 * Two ways to ship this site:
 *  - `npm run build`        → a normal Next.js server build (Vercel/Netlify/Node): API route + on-the-fly image optimisation.
 *  - `npm run build:pages`  → a static export for GitHub Pages (STATIC_EXPORT=1), written to /out.
 *    PAGES_BASE_PATH is the sub-path the site lives under (e.g. "/smemarket"); the Pages workflow sets it.
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const basePath = isStatic ? process.env.PAGES_BASE_PATH || "" : "";

const nextConfig: NextConfig = {
  // a static export is written straight into distDir, so the Pages build always lands in /out
  distDir: process.env.NEXT_DIST_DIR || (isStatic ? "out" : ".next"),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isStatic ? "1" : "",
  },
  ...(isStatic
    ? {
        output: "export",
        // folder-style URLs (/pricing/ → pricing/index.html) so every page and its data file resolve on GitHub Pages
        trailingSlash: true,
        // static hosting has no server, so the API route (route.node.ts) is left out of this build
        pageExtensions: ["tsx", "ts", "jsx", "js"],
        images: {
          loader: "custom",
          loaderFile: "./src/lib/image-loader.ts",
          deviceSizes: [640, 828, 1200, 1920, 2560],
          imageSizes: [64, 128, 256, 384],
        },
      }
    : {
        // server-only files use the .node.ts suffix (the lead API route)
        pageExtensions: ["node.ts", "tsx", "ts", "jsx", "js"],
        images: { formats: ["image/avif", "image/webp"], qualities: [75, 90] },
      }),
};

export default nextConfig;
