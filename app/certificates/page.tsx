/*
 * ═══ app/certificates/page.tsx — every certificate  ( URL: /certificates ) ═══
 *
 * The degree, the professional certifications, the programmes, courses,
 * exam scores and badges — each with its scan, who issued it, when, what it
 * covers and how to verify it. Each card links to the certificate's own page
 * (/certificates/<slug>, app/certificates/[slug]/page.tsx).
 *
 *   Section on screen         Component                                 Data
 *   ────────────────────────  ────────────────────────────────────────  ─────────────────────
 *   The list  #certificates   components/certificates/CertificateList   data/certificates.ts
 *
 * The personal photos are on /gallery. The same list in Arabic: /ar/certificates.
 */

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import { CertificateList } from "@/components/certificates/dynamic";
import { CERTIFICATES, certificateGroupCount } from "@/data/certificates";
import { CERTS_EN } from "@/data/certificates-copy";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { CERTIFICATES_ID, CERTIFICATES_LANGUAGES, CERTIFICATES_URL } from "@/lib/page-ids";
import { CERTIFICATE_SIZES, certificateCredentialLd, certificateImageLd, certificatePageUrl } from "@/lib/certificates-ld";

const TITLE = "Ahmed Emad Nasr — Certificates & Certifications";
const DESCRIPTION = withAudience(
  `All ${CERTIFICATES.length} of Ahmed Emad Nasr's certificates: ${certificateGroupCount("certifications")} professional certifications (eJPT, CCEP, arcX CTI), his degree, DEPI and Banque Misr programmes, Cisco CCNA, TryHackMe, Red Hat and more — with dates, IDs and verification links`,
  300,
);

const base = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/certificates",
  keywords: pageKeywords(KEYWORDS.certificates, [...new Set(CERTIFICATES.map((c) => c.issuer))]),
  share: pageShareImage("certificates", "Ahmed Emad Nasr — certificates"),
});

export const metadata = { ...base, alternates: { canonical: "/certificates", languages: CERTIFICATES_LANGUAGES } };

const STRUCTURED_DATA = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": CERTIFICATES_ID,
      url: CERTIFICATES_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en",
      about: PERSON_REF,
      author: PERSON_REF,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: CERTIFICATES.length,
        itemListElement: CERTIFICATES.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: certificatePageUrl(c),
          name: `${c.title} — ${c.issuer}`,
        })),
      },
    },
    ...CERTIFICATES.flatMap((c) => [certificateCredentialLd(c), certificateImageLd(c)]),
    breadcrumbs([
      ["Ahmed Emad Nasr", absoluteUrl("/")],
      ["Certificates", CERTIFICATES_URL],
    ]),
  ],
});

export default function CertificatesPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      <PageEffects />
      <div className="pt-28 md:pt-32">
        <p className="relative z-10 px-6 md:px-20 -mb-2">
          <span className="flex max-w-7xl mx-auto flex-wrap gap-x-6 gap-y-2">
            {/* The same page in Arabic — no prefetch: it would preload the Arabic font */}
            <Link
              href="/ar/certificates"
              prefetch={false}
              hrefLang="ar"
              className="inline-flex min-h-6 items-center gap-2 text-sm text-foreground/70 hover:text-primary-ink transition-colors"
            >
              <bdi lang="ar">اقرأ هذه الصفحة بالعربية</bdi>
              <span aria-hidden="true">→</span>
            </Link>
            <span className="inline-flex min-h-6 items-center gap-1.5 text-sm text-foreground/60">
              {CERTS_EN.galleryLink}{" "}
              <Link prefetch={false} href="/gallery" className="text-primary-ink hover:text-foreground underline underline-offset-4">
                {CERTS_EN.galleryLinkText}
              </Link>
              .
            </span>
          </span>
        </p>
        <CertificateList sizes={CERTIFICATE_SIZES} />
      </div>
    </PageShell>
  );
}
