/*
 * ═══ components/layout/PageShell.tsx — the FRAME of every page except home ═══
 *
 * The floating navbar, an optional intro loader, <main>, and the footer bar.
 *   <PageShell showLoader> …page content… </PageShell>
 */

import type { ReactNode } from "react";
import SiteNav from "@/components/layout/SiteNav";
import FooterBar from "@/components/layout/FooterBar";
import AppLoader from "@/components/layout/AppLoader";

/* Page frame for every route except the home page: the floating nav, the
   page itself, and the footer bar.
   Usage:  <PageShell showLoader> …page content… </PageShell>
   showLoader → also play the intro boot screen (AppLoader) on this page. */
export default function PageShell({ children, className = "", showLoader = false }: { children: ReactNode; className?: string; showLoader?: boolean }) {
  return (
    <>
      <SiteNav />
      {showLoader && <AppLoader />}
      <main id="main-content" className={`relative w-full bg-background text-foreground overflow-x-clip ${className}`}>
        <div className="site-texture fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
        {children}
      </main>
      <footer className="relative bg-background px-6 md:px-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <FooterBar />
        </div>
      </footer>
    </>
  );
}
