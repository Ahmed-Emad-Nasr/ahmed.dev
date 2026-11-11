"use client";

/*
 * ═══ components/layout/FooterBar.tsx — the LAST LINE of every page ═══
 *
 * The mark, © year, Blog • Gallery • CV and the design credit. The home page
 * shows it at the end of the contact section (ContactFooter); every other
 * page gets it from PageShell.
 *
 * It lives in its own small file on purpose: the contact form is only on the
 * home page, so the other pages must not download it just to draw this line.
 *
 * HOW TO EDIT
 *   • Footer links → the <nav> below. "Security" opens
 *     /.well-known/security.txt; "PGP" appears once a key is published
 *     (PROFILE.contact.pgpFingerprint in data/profile.ts).
 *   • The name / GitHub link → PROFILE in data/profile.ts.
 */

import PageLink from "@/components/ui/PageLink";
import { PROFILE } from "@/data/profile";
import { PGP_KEY_FILE, normalizePublicHref } from "@/lib/shared";

/* The last line of every page: the mark, the copyright, the legal pages and
   the design credit. On the home page it closes the contact section; the
   other pages render it on its own. */
export default function FooterBar({ className = "" }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  return (
    <div className={`pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-6 text-on-surface-variant font-mono text-[0.625rem] tracking-[0.3em] uppercase ${className}`}>
      <div className="flex items-center gap-4">
        <span className="text-primary-ink font-black text-base tracking-normal font-display">
          AE.
        </span>
        {/* The HTML is built once; the year can roll over before the next
            build, so the browser's year wins without a hydration warning */}
        <span suppressHydrationWarning>
          © {currentYear} {PROFILE.name}
        </span>
      </div>
      <nav aria-label="Site information" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <PageLink href="/blog" className="hover:text-primary-ink transition-colors">Blog</PageLink>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <PageLink href="/gallery" className="hover:text-primary-ink transition-colors">Gallery</PageLink>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        <PageLink href="/cv" className="hover:text-primary-ink transition-colors">CV</PageLink>
        <span className="text-primary-ink" aria-hidden="true">•</span>
        {/* Files, not pages: plain links (how to report a security issue) */}
        <a href={normalizePublicHref(".well-known/security.txt")} className="hover:text-primary-ink transition-colors">
          Security
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
      <div className="flex items-center gap-2 text-on-surface-variant">
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
        <span className="text-primary-ink">•</span>
        <span lang="ja" aria-hidden="true" data-jp="次のレベル" />
      </div>
    </div>
  );
}
