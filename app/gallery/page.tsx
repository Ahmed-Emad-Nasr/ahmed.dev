/*
 * ═══ app/gallery/page.tsx — the GALLERY page  ( URL: /gallery ) ═══
 *
 * The proof behind the portfolio: the degree, every certificate, course and
 * record, then photos from classrooms and events. ?cert=N opens scan N in
 * the lightbox (the command palette links to them).
 *
 *   Section on screen      Component                          Content / data
 *   ─────────────────────  ─────────────────────────────────  ──────────────────────────
 *   Gallery      #gallery  components/gallery/ArtGallery      data/certifications.ts, portfolio-data.ts
 */

import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import { ArtGallery } from "@/components/gallery/dynamic";
import { OG_IMAGE, absoluteUrl } from "@/lib/site";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { GALLERY_ID, GALLERY_URL } from "@/lib/page-ids";

/* What a search result shows: the name first, so "Ahmed Emad Nasr
   certificates" matches */
const DESCRIPTION =
  "Ahmed Emad Nasr's certificates and proof: his degree, professional cybersecurity certifications (eJPT, CCNA …), courses and records, and photos from classrooms and security events.";
const TITLE = "Ahmed Emad Nasr — Certificates & Gallery";

export const metadata: Metadata = {
  /* absolute: the name is already in it (no " | Ahmed Emad Nasr" template) */
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.gallery),
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: GALLERY_URL,
    type: "website",
    siteName: "Ahmed Emad Nasr",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@0x3omda",
    creator: "@0x3omda",
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

/* JSON-LD: the gallery (its images are listed in sitemap.xml) + breadcrumbs */
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
    },
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
        <ArtGallery />
      </div>
    </PageShell>
  );
}
