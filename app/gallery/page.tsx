/*
 * ═══ app/gallery/page.tsx — the GALLERY page  ( URL: /gallery ) ═══
 *
 * The personal photos: classes, the GDG bootcamp, the Banque Misr
 * internship, the graduation project and the races — each with its full
 * caption, and the official posts named as their source. The certificates
 * have their own page (/certificates); old /gallery?cert=N links go there.
 *
 *   Section on screen      Component                          Content / data
 *   ─────────────────────  ─────────────────────────────────  ──────────────────────────
 *   Gallery      #gallery  components/gallery/ArtGallery      data/gallery-photos.ts
 */

import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import { ArtGallery } from "@/components/gallery/dynamic";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { GALLERY_ID, GALLERY_LANGUAGES, GALLERY_URL } from "@/lib/page-ids";
import { X_HANDLE } from "@/lib/shared";
import { GALLERY_PHOTOS } from "@/data/gallery-photos";
import { GALLERY_PROPS, photoImageLd } from "@/lib/gallery-ld";

/* What a search result shows: the name first, so "Ahmed Emad Nasr
   photos" matches */
/* The audience line (AUDIENCE in lib/shared.ts) is added to the description */
const DESCRIPTION = withAudience(
  `${GALLERY_PHOTOS.length} photos of Ahmed Emad Nasr: teaching cybersecurity (NTI, GDG on Campus Benha), the Banque Misr Rowad internship, his graduation project, and his athletics titles — with the official posts`,
  300,
);
const TITLE = "Ahmed Emad Nasr — Photo Gallery";

/* This page's own share card (npm run og:cases), else the site card */
const SHARE_IMAGE = pageShareImage("gallery", "Ahmed Emad Nasr — photo gallery");

export const metadata: Metadata = {
  /* absolute: the name is already in it (no " | Ahmed Emad Nasr" template) */
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.gallery),
  alternates: { canonical: "/gallery", languages: GALLERY_LANGUAGES },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: GALLERY_URL,
    type: "website",
    siteName: "Ahmed Emad Nasr",
    locale: "en_US",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
  },
};

/* JSON-LD: the gallery and every photo as an ImageObject (caption, date,
   place, credit, copyright, licence) + breadcrumbs */
const STRUCTURED_DATA = jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ImageGallery",
      "@id": GALLERY_ID,
      url: GALLERY_URL,
      name: TITLE,
      description: DESCRIPTION,
      keywords: KEYWORDS.gallery.join(", "),
      about: PERSON_REF,
      author: PERSON_REF,
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: "en",
      associatedMedia: GALLERY_PHOTOS.map((p) => ({ "@id": `${GALLERY_URL}#${p.slug}` })),
    },
    ...GALLERY_PHOTOS.map(photoImageLd),
    breadcrumbs([
      ["Ahmed Emad Nasr", absoluteUrl("/")],
      ["Gallery", GALLERY_URL],
    ]),
  ],
});

export default function GalleryPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }} />
      {/* No UI: #anchor jumps (lib/perf/PageEffects.tsx) */}
      <PageEffects />

      {/* pt: room for the fixed navbar. The id is on this wrapper: the
          gallery's own <section> is #art */}
      <div id="gallery" className="pt-28 md:pt-32">
        {/* The same page in Arabic (app/ar/gallery/page.tsx) — no prefetch: it would preload the Arabic font */}
        <p className="relative z-10 px-6 md:px-20 -mb-2">
          <span className="block max-w-7xl mx-auto">
            <Link
              href="/ar/gallery"
              prefetch={false}
              hrefLang="ar"
              className="inline-flex min-h-6 items-center gap-2 text-sm text-foreground/70 hover:text-primary-ink transition-colors"
            >
              <bdi lang="ar">اقرأ هذه الصفحة بالعربية</bdi>
              <span aria-hidden="true">→</span>
            </Link>
          </span>
        </p>
        <ArtGallery {...GALLERY_PROPS} />
      </div>
    </PageShell>
  );
}
