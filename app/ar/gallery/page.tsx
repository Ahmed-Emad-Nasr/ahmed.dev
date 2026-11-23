/*
 * ═══ app/ar/gallery/page.tsx — /gallery in Arabic  ( URL: /ar/gallery ) ═══
 *
 * The same certificates and photos as app/gallery/page.tsx, with the page's
 * own words in Arabic, right to left. The certificate and photo titles stay
 * as written in data/certifications.ts and data/portfolio-data.ts (they are
 * the names printed on the documents). The two pages name each other
 * (hreflang), so Google shows each one to its language.
 *
 * The words: data/gallery-copy.ts (GALLERY_AR).
 */

import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import { ArtGallery } from "@/components/gallery/dynamic";
import { GALLERY_AR } from "@/data/gallery-copy";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { AUDIENCE_LINE_AR } from "@/lib/shared";
import { GALLERY_AR_URL, GALLERY_ID, GALLERY_LANGUAGES } from "@/lib/page-ids";
import { arabicFont } from "@/app/ar/fonts";

const TITLE = "شهادات أحمد عماد نصر ومعرض الصور — أمن سيبراني";
/* The audience line (AUDIENCE in lib/shared.ts) is added to the description */
const DESCRIPTION = withAudience(
  "شهادات أحمد عماد نصر ووثائقه: الشهادة الجامعية، والشهادات الاحترافية في الأمن السيبراني (eJPT و CCNA …)، والدورات، وصور من قاعات التدريس وفعاليات الأمن السيبراني",
  400,
  AUDIENCE_LINE_AR,
);

const base = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/ar/gallery",
  keywords: pageKeywords(KEYWORDS.galleryAr, KEYWORDS.gallery),
  share: pageShareImage("gallery", "أحمد عماد نصر — الشهادات ومعرض الصور"),
});

export const metadata = {
  ...base,
  alternates: { canonical: "/ar/gallery", languages: GALLERY_LANGUAGES },
  openGraph: { ...base.openGraph, locale: "ar_EG", alternateLocale: ["en_US"] },
};

const STRUCTURED_DATA = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageGallery",
      "@id": `${GALLERY_AR_URL}#gallery`,
      url: GALLERY_AR_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "ar",
      about: PERSON_REF,
      author: PERSON_REF,
      isPartOf: { "@id": WEBSITE_ID },
      translationOfWork: { "@id": GALLERY_ID },
    },
    breadcrumbs([
      ["أحمد عماد نصر", absoluteUrl("/")],
      ["الشهادات", GALLERY_AR_URL],
    ]),
  ],
});

export default function ArabicGalleryPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      {/* No UI: #anchor jumps (lib/perf/PageEffects.tsx) */}
      <PageEffects />
      {/* lang + dir: Arabic, right to left; the Cairo font (app/ar/fonts.ts) and .lang-ar in globals.css */}
      <div id="gallery" lang="ar" dir="rtl" className={`lang-ar ${arabicFont.variable} pt-28 md:pt-32`}>
        <p className="relative z-10 px-6 md:px-20 -mb-2">
          <span className="block max-w-7xl mx-auto">
            <Link
              href="/gallery"
              prefetch={false}
              hrefLang="en"
              lang="en"
              dir="ltr"
              className="inline-flex min-h-6 items-center gap-2 text-sm text-foreground/70 hover:text-primary-ink transition-colors"
            >
              Read this page in English <span aria-hidden="true">→</span>
            </Link>
          </span>
        </p>
        <ArtGallery copy={GALLERY_AR} />
      </div>
    </PageShell>
  );
}
