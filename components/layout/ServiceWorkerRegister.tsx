"use client";

/* Registers public/sw.js (offline support) after the page has loaded, in
   production only — in development a cached page would hide every change.

   ═══ components/layout/ServiceWorkerRegister.tsx ═══
   The caching rules live in public/sw.js. If a visitor sees an old version
   of the site after you deploy, it's that cache — bump the cache name inside
   public/sw.js so browsers drop the old copy. To turn offline support off,
   remove <ServiceWorkerRegister /> from app/layout.tsx. */

import { useEffect } from "react";
import { normalizePublicHref } from "@/lib/shared";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register(normalizePublicHref("sw.js")).catch(() => {});
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
