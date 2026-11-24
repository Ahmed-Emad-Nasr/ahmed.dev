"use client";

/*
 * ═══ components/layout/FooterBar.tsx — the LAST LINE of every page ═══
 *
 * The mark, © year, Blog • Gallery • CV and the design credit. The home page
 * ends with it (app/page.tsx); the case pages get it from PageShell.
 * It spans the full width of the page and stays on ONE row from lg (1024px)
 * up — nothing in it may wrap there (whitespace-nowrap, no flex-wrap). On a
 * phone, where one row cannot fit, the three parts stack and the links wrap.
 *
 * HOW TO EDIT
 *   • Footer links → the <nav> below. "Security" opens
 *     /.well-known/security.txt; "PGP" appears once a key is published
 *     (PROFILE.contact.pgpFingerprint in data/profile.ts).
 *   • The name / GitHub link → PROFILE in data/profile.ts.
 */

import Link from "next/link";
import { PROFILE } from "@/data/profile";
import { PGP_KEY_FILE, REPO_URL, normalizePublicHref } from "@/lib/shared";

/* The last line of every page: the mark, the copyright, the legal pages and
   the design credit */
export default function FooterBar({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  return (
    <div className={`pt-8 border-t border-foreground/5 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-4 xl:gap-8 text-on-surface-variant font-mono text-[0.625rem] tracking-[0.3em] lg:tracking-[0.05em] xl:tracking-[0.16em] 2xl:tracking-[0.24em] uppercase lg:whitespace-nowrap ${className}`}>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-primary-ink font-black text-base tracking-normal font-display">
          AE.
        </span>
        {/* The HTML is built once; the year can roll over before the next
            build, so the browser's year wins without a hydration warning */}
        <span suppressHydrationWarning>
          © {currentYear} {PROFILE.name}
        </span>
      </div>
      {/* [&_a]:min-h-6: every link is at least 24px tall, so wrapped rows on
          a phone stay easy to tap (WCAG 2.5.8 target size) */}
      <nav aria-label="Site information" className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-4 lg:gap-x-1.5 xl:gap-x-2.5 2xl:gap-x-4 gap-y-2 [&_a]:inline-flex [&_a]:min-h-6 [&_a]:items-center">
        <Link prefetch={false} href="/blog" className="hover:text-primary-ink transition-colors">Blog</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <Link prefetch={false} href="/teaching" className="hover:text-primary-ink transition-colors">Teaching</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <Link prefetch={false} href="/certificates" className="hover:text-primary-ink transition-colors">Certificates</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <Link prefetch={false} href="/gallery" className="hover:text-primary-ink transition-colors">Gallery</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <Link prefetch={false} href="/videos" className="hover:text-primary-ink transition-colors">Videos</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <Link prefetch={false} href="/attack" className="hover:text-primary-ink transition-colors">ATT&amp;CK</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <Link prefetch={false} href="/training" className="hover:text-primary-ink transition-colors">Training</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        {/* The CV page (it has the PDF download) */}
        <Link prefetch={false} href="/cv" className="hover:text-primary-ink transition-colors">CV</Link>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        {/* A file, not a page: how to report a security issue */}
        <a href={normalizePublicHref(".well-known/security.txt")} className="hover:text-primary-ink transition-colors">
          Security
        </a>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        {/* Code GPL-3.0, content all rights reserved (CONTENT-LICENSE.md) */}
        <a
          href={`${REPO_URL}/blob/master/CONTENT-LICENSE.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-ink transition-colors"
        >
          License
        </a>
        {PROFILE.contact.pgpFingerprint && (
          <>
            <span className="text-primary-ink" aria-hidden="true">•</span>
            <a
              href={normalizePublicHref(PGP_KEY_FILE)}
              title={`PGP fingerprint: ${PROFILE.contact.pgpFingerprint}`}
              className="hover:text-primary-ink transition-colors"
            >
              PGP
            </a>
          </>
        )}
      </nav>
      <div className="flex items-center gap-2 shrink-0 whitespace-nowrap text-on-surface-variant">
        <span>
          Design{" "}
          <a
            href={`https://github.com/${PROFILE.contact.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-ink transition-colors"
          >
            Ahmed Emad Nasr
          </a>
        </span>
      </div>
    </div>
  );
}
