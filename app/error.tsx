"use client";

/* Route-level error boundary: a message and a retry instead of a blank page

   ═══ app/error.tsx — shown when a page CRASHES while running in the browser ═══
   Next.js shows this automatically if any component throws an error. The
   navbar and footer still work (PageShell). To change the wording, edit the
   <h1> and the <p> below. app/global-error.tsx is the fallback for when even
   app/layout.tsx crashes. */

import { useEffect } from "react";
import PageLink from "@/components/ui/PageLink";
import { RotateCcw } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import {
  ctaPrimary, ctaSecondary,
  statusActions, statusCode, statusInner, statusLede, statusPage, statusReport, statusTitle,
} from "@/components/ui/kit";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /*
     * The site is a static export on GitHub Pages — there's no server to receive error
     * reports. The console is the only place available, and it's enough: if someone
     * reports a problem you can ask them to open it.
     *
     * If you add a monitoring service later (Sentry, for example), it goes here.
     */
    console.error("[portfolio] unhandled error:", error);
  }, [error]);

  return (
    <PageShell>
      <section className={statusPage}>
        <div className={statusInner}>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            <span className="text-primary-ink text-[0.6875rem] font-mono font-bold tracking-[0.35em] uppercase">Something went wrong</span>
            <span className="jp-eyebrow text-[0.6875rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp="故障" />
          </div>
          <p className={statusCode} aria-hidden="true">ERR</p>

          <h1 className={statusTitle}>Something <span className="text-primary italic">broke.</span></h1>
          <p className={statusLede}>
            This part of the page failed to load — the fault is on the site,
            not on your device. Press “Try again”; if it happens twice, the
            rest of the site still works.
          </p>

          <nav className={statusActions} aria-label="Recovery options">
            {/* reset tries to re-render the part that crashed without a full reload —
                most transient errors are resolved by it. */}
            <button type="button" className={ctaPrimary} onClick={reset}>
              <RotateCcw size={16} /> Try again
            </button>
            <PageLink href="/" className={ctaSecondary}>Go to the home page</PageLink>
            <PageLink href="/blog#cases" className={ctaSecondary}>Browse the cases</PageLink>
          </nav>

          {/* digest is the hash Next generates for the error. It's shown so that if someone
              reports a problem they can give you this number instead of a vague description. */}
          {error.digest && (
            <p className={statusReport}>Error reference: {error.digest}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}
