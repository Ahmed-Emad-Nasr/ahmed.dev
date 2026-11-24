/*
 * ═══ lib/gallery-ld.ts — what the gallery pages hand to the gallery ═══
 *
 * Server only (reads image sizes from public/): app/gallery and app/ar/gallery.
 *
 *   photoImageLd(p)   → the photo's ImageObject (lib/image-meta.ts): caption,
 *                       date, place, credit, copyright, licence
 *   GALLERY_PROPS     → the props of <ArtGallery>: thumbnail sizes, the old
 *                       ?cert=N map, the certificate count
 */

import {
  GALLERY_PHOTOS,
  formatPhotoDate,
  photoImagePath,
  photoKeywords,
  photoThumbPath,
  type GalleryPhoto,
} from "@/data/gallery-photos";
import { CERTIFICATES } from "@/data/certificates";
import { imageObject, imageSize } from "@/lib/image-meta";
import { GALLERY_URL } from "@/lib/page-ids";

export const photoImageLd = (p: GalleryPhoto) =>
  imageObject({
    id: `${GALLERY_URL}#${p.slug}`,
    src: photoImagePath(p.slug),
    thumb: photoThumbPath(p.slug),
    name: p.title,
    caption: [p.title, formatPhotoDate(p.date), p.place].filter(Boolean).join(" — "),
    description: [p.description, p.source && `Source: ${p.source}.`].filter(Boolean).join(" "),
    pageUrl: `${GALLERY_URL}#${p.slug}`,
    keywords: photoKeywords(p),
    date: p.date,
    place: p.place,
    copyrightNotice: "© Ahmed Emad Nasr. All rights reserved.",
  });

export const GALLERY_PROPS = {
  sizes: Object.fromEntries(
    GALLERY_PHOTOS.flatMap((p) => {
      const s = imageSize(photoThumbPath(p.slug)) ?? imageSize(photoImagePath(p.slug));
      return s ? [[p.slug, s]] : [];
    }),
  ),
  legacyCerts: Object.fromEntries(CERTIFICATES.flatMap((c) => (c.legacyIndex ? [[c.legacyIndex, c.slug]] : []))),
  certificateCount: CERTIFICATES.length,
};
