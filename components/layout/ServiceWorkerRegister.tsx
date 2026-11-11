"use client";

/* Registers public/sw.js (offline support) after the page has loaded, in
   production only — in development a cached page would hide every change.

   ═══ components/layout/ServiceWorkerRegister.tsx ═══
   The caching rules live in public/sw.js. It is registered as
   sw.js?v=<build id> (NEXT_PUBLIC_BUILD_ID, next.config.mjs): every deploy
   is a new URL, so browsers install the new worker and it drops the old
   deploy's page cache by itself — nothing to bump by hand. To turn offline
   support off, remove <ServiceWorkerRegister /> from app/layout.tsx. */

import { useEffect } from "react";
import { normalizePublicHref } from "@/lib/shared";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => {
      const build = encodeURIComponent(process.env.NEXT_PUBLIC_BUILD_ID ?? "dev");
      navigator.serviceWorker.register(normalizePublicHref(`sw.js?v=${build}`)).catch(() => {});
    };
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
