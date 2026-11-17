import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a preview build live beside `next dev` without clobbering it.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
};

export default nextConfig;
