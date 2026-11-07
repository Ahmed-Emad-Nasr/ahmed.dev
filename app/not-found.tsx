/* The 404 page (GitHub Pages serves it for any unknown path): ways to continue, no dead end */

import Link from "next/link";
import PageLink from "@/components/ui/PageLink";
import type { Metadata } from "next";
import { startHere } from "@/data/start-here";
import { caseEvidenceLibrary } from "@/data/cases";
import { Home, FolderSearch, Download, Mail } from "lucide-react";
import { CV_PDF_HREF, normalizePublicHref } from "@/lib/shared";
import {
  statusActions, statusCode, statusInner, statusLede, statusPage, statusReport, statusTitle,
} from "@/components/ui/kit";
import { PageShell, KanjiWatermark, ctaPrimary, ctaSecondary } from "@/components/ui/kit";

export const metadata: Metadata = {
  title: "Page not found",
  // noindex: there's no point indexing an error page
  robots: { index: false, follow: true },
};

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
            <span className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">Error 404 · Page not found</span>
            <span className="jp-eyebrow text-[0.6875rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp="迷子" />
          </div>
          <p className={statusCode} aria-hidden="true">404</p>

          <h1 className={statusTitle}>This page isn&apos;t <span className="text-primary italic">here.</span></h1>
          <p className={statusLede}>
            The link may be old, or there may be a small typo in the address.
            Nothing is broken on your side — pick one of these to carry on.
          </p>

          <nav className={statusActions} aria-label="Main destinations">
            <Link href="/" className={ctaPrimary}>
              <Home size={16} /> Go to the home page
            </Link>
            <PageLink href="/blog#cases" className={ctaSecondary}>
              <FolderSearch size={14} className="text-primary-ink" /> Browse case studies
            </PageLink>
            <a href={normalizePublicHref(CV_PDF_HREF)} download className={ctaSecondary}>
              <Download size={14} className="text-primary-ink" /> Download CV
            </a>
            <Link href="/#contact" className={ctaSecondary}>
              <Mail size={14} className="text-primary-ink" /> Contact me
            </Link>
          </nav>

          {SUGGESTIONS.length > 0 && (
            <section aria-labelledby="nf-suggest">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-[2px] bg-primary" aria-hidden="true" />
                <h2 id="nf-suggest" className="font-mono text-[0.625rem] text-primary-ink tracking-[0.35em] uppercase font-bold">
                  Or read one of my best case studies
                </h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SUGGESTIONS.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/blog/${entry.id}`}
                      className="group spotlight relative flex h-full flex-col bg-surface/60 border border-foreground/5 p-6 hover:border-primary/40 transition-colors duration-500"
                    >
                      <span className="font-display text-lg font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                        {entry.label}
                      </span>
                      <span className="text-sm text-foreground/60 font-light leading-relaxed">{entry.why}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className={statusReport}>
            Got here from a link on this site?{" "}
            <a href="mailto:ahmed.em.nasr@gmail.com?subject=Broken%20link%20on%20portfolio">Email me which one</a>{" "}
            and I&apos;ll fix it.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
