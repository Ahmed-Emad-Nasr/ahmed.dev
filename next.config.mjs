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
  /* A per-deploy id: the commit on GitHub Actions, the build time locally.
     public/sw.js is registered as sw.js?v=<this>, so each deploy renews the
     offline cache by itself (components/layout/ServiceWorkerRegister.tsx). */
  env: { NEXT_PUBLIC_BUILD_ID: (process.env.GITHUB_SHA ?? Date.now().toString(36)).slice(0, 12) },
  experimental: { optimizePackageImports: ["framer-motion", "lucide-react"] },
};

export default nextConfig;
