/*
 * ═══ app/gallery/page.tsx — the GALLERY PAGE  ( URL: /gallery ) ═══
 *
 * Certificates, badges, events and classroom photos. The whole page body is
 * one component, components/gallery/ArtGallery.tsx, loaded lazily (its own
 * chunk, mounted right after the page starts — see LazySection).
 *
 * HOW TO EDIT
 *   • Add a photo / certificate    → numbered image file + GALLERY_IMAGE_COUNT
 *                                    (and ALL_GALLERY_CERTIFICATES for a certificate)
 *                                    in data/certifications.ts — full steps in
 *                                    the header of components/gallery/ArtGallery.tsx
 *   • Layout, filters, lightbox    → components/gallery/ArtGallery.tsx
 *   • Page title / description     → `metadata` below
 *   • If the gallery grows a lot, update .lazy-h-gallery in app/globals.css
 *     (its rough height) so #anchor links stay accurate before it loads.
 */

import type { Metadata } from "next";
import { PageShell } from "@/components/ui/kit";
import { ArtGallery } from "@/components/gallery/dynamic";
import LazySection from "@/lib/perf/lazy";
import PageEffects from "@/lib/perf/PageEffects";
import { absoluteUrl, OG_IMAGE } from "@/lib/site";
import { jsonLd, PERSON_REF, SITE_URL } from "@/lib/seo";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";

/* Used for the meta description and share cards */
const DESCRIPTION = "Certificates, events, the classroom and moments from Ahmed Emad Nasr's information security journey.";

export const metadata: Metadata = {
  title: "Gallery — Proof, Certificates & Moments",
  description: DESCRIPTION,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery — Ahmed Emad Nasr",
    description: DESCRIPTION,
    url: absoluteUrl("/gallery"),
    type: "website",
    siteName: "ahmed.dev",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: "Gallery — Ahmed Emad Nasr", description: DESCRIPTION, images: [OG_IMAGE.url] },
};

/* JSON-LD (invisible): every gallery image, generated from data/portfolio-data.ts */
function structuredData() {
  const galleryUrl = absoluteUrl("/gallery");
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${galleryUrl}#gallery`,
    url: galleryUrl,
    name: "Proof gallery — Ahmed Emad Nasr",
    description: DESCRIPTION,
    about: PERSON_REF,
    author: PERSON_REF,
    isPartOf: { "@id": `${SITE_URL}#website` },
    image: PORTFOLIO_DATA.artGallery.map((item) => ({
      "@type": "ImageObject",
      contentUrl: absoluteUrl(item.src.replace(/^\/ahmed\.dev/, "")),
      name: item.title,
      description: item.description,
      caption: item.title,
      creator: { "@type": "Person", name: item.creator },
      keywords: item.keywords.join(", "),
    })),
  });
}

export default function GalleryPage() {
  return (
    /* PageShell = navbar + <main> + footer bar; showLoader = intro boot screen */
    <PageShell showLoader>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* Makes /gallery#all-certificates etc. land on the right spot once the gallery loads */}
      <PageEffects />
      <LazySection id="art" size="lazy-h-gallery">
        <ArtGallery />
      </LazySection>
    </PageShell>
  );
}
