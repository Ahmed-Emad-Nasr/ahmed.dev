/* The 404 page (GitHub Pages serves it for any unknown path): ways to continue, no dead end

   ═══ app/not-found.tsx — the 404 PAGE ═══
   Built into out/404.html; GitHub Pages shows it for any URL that doesn't
   exist. HOW TO EDIT:
     • the buttons → the <nav> below (ahmed.dev / Case library / CV),
     • the 3 suggested cases → the first entries of data/start-here.ts,
     • the wording → the <h1> and <p> below. */

import PageLink from "@/components/ui/PageLink";
import type { Metadata } from "next";
import { startHere } from "@/data/start-here";
import { caseEvidenceLibrary } from "@/data/cases";
import { Home, FolderSearch, FileText } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import {
  KanjiWatermark, ctaPrimary, ctaSecondary,
  statusActions, statusCode, statusInner, statusLede, statusPage, statusReport, statusTitle,
} from "@/components/ui/kit";

export const metadata: Metadata = {
  title: "Page not found",
  // noindex: there's no point indexing an error page
  robots: { index: false, follow: true },
  /* No canonical: the layout's "/" would tell crawlers this 404 is the home page */
  alternates: { canonical: null },
};

/* Suggest the first 3 "start here" cases that really exist in data/cases.ts */
const KNOWN = new Set(caseEvidenceLibrary.map((item) => item.id));
const SUGGESTIONS = startHere.filter((entry) => KNOWN.has(entry.id)).slice(0, 3);

export default function NotFound() {
  return (
    <PageShell>
      <section className={statusPage}>
        <KanjiWatermark chars="迷子" side="right" />
        <div className={statusInner}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            <span className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">Page not found</span>
            <span className="jp-eyebrow text-[0.6875rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp="迷子" />
          </div>
          <p className={statusCode} aria-hidden="true">404</p>

          <h1 className={statusTitle}>This page doesn&apos;t <span className="text-primary italic">exist.</span></h1>
          <p className={statusLede}>
            Nothing is broken on your side. The link you followed is old, or
            the address has a typo. Pick where to go next:
          </p>

          <nav className={statusActions} aria-label="Main destinations">
            <PageLink href="/" className={ctaPrimary}>
              <Home size={16} /> Go to the home page
            </PageLink>
            <PageLink href="/blog#cases" className={ctaSecondary}>
              <FolderSearch size={14} className="text-primary-ink" /> Browse the cases
            </PageLink>
            <PageLink href="/cv" className={ctaSecondary}>
              <FileText size={14} className="text-primary-ink" /> Read my CV
            </PageLink>
          </nav>

          {SUGGESTIONS.length > 0 && (
            <section aria-labelledby="nf-suggest">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-[2px] bg-primary" aria-hidden="true" />
                <h2 id="nf-suggest" className="font-mono text-[0.625rem] text-primary-ink tracking-[0.35em] uppercase font-bold">
                  Or read one of these first
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUGGESTIONS.map((entry) => (
                  <li key={entry.id}>
                    <PageLink
                      href={`/blog/${entry.id}`}
                      className="group spotlight relative flex h-full flex-col bg-surface/60 border border-foreground/5 p-6 hover:border-primary/40 transition-colors duration-500"
                    >
                      <span className="font-display text-lg font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                        {entry.label}
                      </span>
                      <span className="text-sm text-foreground/60 font-light leading-relaxed">{entry.why}</span>
                    </PageLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className={statusReport}>
            Landed here from a link on this site?{" "}
            <a href="mailto:ahmed.em.nasr@gmail.com?subject=Broken%20link%20on%20portfolio">Tell me which one</a>{" "}
            and I&apos;ll fix it.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
