/** @type {import('next').NextConfig} */

/* The site lives under /ahmed.dev on GitHub Pages. basePath prefixes Next's
   own files and links; normalizePublicHref() (lib/shared.ts) prefixes plain
   asset paths with the same value. */
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/ahmed.dev" : "");

/* ═══ next.config.mjs — Next.js settings ═══
   output: "export"  → `npm run build` writes a plain static website to out/
                       (HTML/CSS/JS files) — that folder is what GitHub Pages
                       serves. No server, so no API routes or server actions.
   reactStrictMode   → dev-only extra checks (effects run twice in dev).
   optimizePackageImports → only the icons / motion pieces actually used
                       are bundled. */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: BASE_PATH,
  /* Static export: no image optimizer; thumbnails are pre-generated (npm run thumbs) */
  images: { unoptimized: true },
  experimental: { optimizePackageImports: ["framer-motion", "lucide-react"] },
};

export default nextConfig;
