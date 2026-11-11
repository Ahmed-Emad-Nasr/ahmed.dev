/*
 * ═══ components/layout/PageShell.tsx — the FRAME of every page except home ═══
 *
 * The floating navbar, <main>, and the footer bar. (The intro loader is on
 * the home page only — app/page.tsx.)
 *   <PageShell> …page content… </PageShell>
 */

import type { ReactNode } from "react";
import SiteNav from "@/components/layout/SiteNav";
import FooterBar from "@/components/layout/FooterBar";

/* Page frame for every route except the home page: the floating nav, the
   page itself, and the footer bar.
   Usage:  <PageShell> …page content… </PageShell> */
export default function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <>
      <SiteNav />
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
