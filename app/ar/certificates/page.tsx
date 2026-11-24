/*
 * ═══ app/ar/certificates/page.tsx — /certificates in Arabic  ( URL: /ar/certificates ) ═══
 *
 * The same certificates as app/certificates/page.tsx, with the page's own
 * words in Arabic, right to left. The certificate titles stay as written in
 * data/certificates.ts (they are the names printed on the documents); each
 * card links to the certificate's own (English) page. The two pages name
 * each other (hreflang).
 *
 * The words: data/certificates-copy.ts (CERTS_AR).
 */

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import { CertificateList } from "@/components/certificates/dynamic";
import { CERTIFICATES, certificateGroupCount } from "@/data/certificates";
import { CERTS_AR } from "@/data/certificates-copy";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { AUDIENCE_LINE_AR } from "@/lib/shared";
import { CERTIFICATES_AR_URL, CERTIFICATES_ID, CERTIFICATES_LANGUAGES } from "@/lib/page-ids";
import { CERTIFICATE_SIZES, certificatePageUrl } from "@/lib/certificates-ld";
import { arabicFont } from "@/app/ar/fonts";

const TITLE = "شهادات أحمد عماد نصر — أمن سيبراني وأمن معلومات";
const DESCRIPTION = withAudience(
  `كل شهادات أحمد عماد نصر (${CERTIFICATES.length} وثيقة): ${certificateGroupCount("certifications")} شهادات احترافية بامتحان (eJPT و CCEP و arcX)، والشهادة الجامعية، وبرامج DEPI وبنك مصر، و CCNA من سيسكو، و TryHackMe و Red Hat وغيرها — بالتواريخ وأرقام الشهادات وروابط التحقق`,
  400,
  AUDIENCE_LINE_AR,
);

const base = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/ar/certificates",
  keywords: pageKeywords(KEYWORDS.certificatesAr, KEYWORDS.certificates),
  share: pageShareImage("certificates", "أحمد عماد نصر — الشهادات"),
});

export const metadata = {
  ...base,
  alternates: { canonical: "/ar/certificates", languages: CERTIFICATES_LANGUAGES },
  openGraph: { ...base.openGraph, locale: "ar_EG", alternateLocale: ["en_US"] },
};

const STRUCTURED_DATA = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${CERTIFICATES_AR_URL}#certificates`,
      url: CERTIFICATES_AR_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "ar",
      about: PERSON_REF,
      author: PERSON_REF,
      isPartOf: { "@id": WEBSITE_ID },
      translationOfWork: { "@id": CERTIFICATES_ID },
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
    breadcrumbs([
      ["أحمد عماد نصر", absoluteUrl("/")],
      ["الشهادات", CERTIFICATES_AR_URL],
    ]),
  ],
});

export default function ArabicCertificatesPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      <PageEffects />
      {/* lang + dir: Arabic, right to left; the Cairo font (app/ar/fonts.ts) and .lang-ar in globals.css */}
      <div lang="ar" dir="rtl" className={`lang-ar ${arabicFont.variable} pt-28 md:pt-32`}>
        <p className="relative z-10 px-6 md:px-20 -mb-2">
          <span className="flex max-w-7xl mx-auto flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/certificates"
              prefetch={false}
              hrefLang="en"
              lang="en"
              dir="ltr"
              className="inline-flex min-h-6 items-center gap-2 text-sm text-foreground/70 hover:text-primary-ink transition-colors"
            >
              Read this page in English <span aria-hidden="true">→</span>
            </Link>
            <span className="inline-flex min-h-6 items-center gap-1.5 text-sm text-foreground/60">
              {CERTS_AR.galleryLink}{" "}
              <Link prefetch={false} href="/ar/gallery" className="text-primary-ink hover:text-foreground underline underline-offset-4">
                {CERTS_AR.galleryLinkText}
              </Link>
              .
            </span>
          </span>
        </p>
        <CertificateList copy={CERTS_AR} sizes={CERTIFICATE_SIZES} />
      </div>
    </PageShell>
  );
}
