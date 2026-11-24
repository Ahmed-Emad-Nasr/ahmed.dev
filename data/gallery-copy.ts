/*
 * ═══ data/gallery-copy.ts — the words of the gallery pages ═══
 *
 *   GALLERY_EN → /gallery      GALLERY_AR → /ar/gallery
 *
 * Drawn by components/gallery/ArtGallery.tsx. The gallery holds the personal
 * photos only (data/gallery-photos.ts); the certificates have their own page
 * (/certificates, data/certificates.ts).
 *
 * Plain text only (the gallery runs in the browser, so no functions here):
 * {photos} = photos, {certs} = documents on /certificates.
 * A change to one language should be made in the other as well.
 */

import type { PhotoCategory } from "@/data/gallery-photos";

export type GalleryCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  /** {photos} = photos */
  description: string;
  statPhotos: string;
  statRaces: string;
  filterLabel: string;
  filters: Record<PhotoCategory | "all", string>;
  /** "Open" + the photo's title + "full size" */
  openPhoto: string;
  openPhotoAfter: string;
  /** "Source:" before an official post's author */
  source: string;
  showMore: string;
  /** The link to the certificates page: text before the link, the link, text after ({certs}) */
  certsBefore: string;
  certsLink: string;
  certsAfter: string;
};

export const GALLERY_EN: GalleryCopy = {
  eyebrow: "Ahmed Emad Nasr // Gallery",
  titleA: "Visual",
  titleB: "Archive.",
  description:
    "{photos} photos from my life outside the documents: the classes I taught, the bootcamp I helped run, the Banque Misr internship, my graduation project, and the races — with the official posts that announced them. Each photo says what it is, when and where.",
  statPhotos: "Photos",
  statRaces: "Official posts",
  filterLabel: "Filter photos by topic",
  filters: {
    all: "Everything",
    athletics: "Athletics",
    teaching: "Teaching",
    community: "Community & events",
    internship: "Banque Misr internship",
    university: "University",
  },
  openPhoto: "Open",
  openPhotoAfter: "full size",
  source: "Source:",
  showMore: "Show more",
  certsBefore: "Looking for the certificates? All",
  certsLink: "{certs} documents",
  certsAfter: "have their own page.",
};

export const GALLERY_AR: GalleryCopy = {
  eyebrow: "أحمد عماد نصر // معرض الصور",
  titleA: "الأرشيف",
  titleB: "المصوّر.",
  description:
    "{photos} صورة من حياتي خارج الوثائق: المحاضرات التي قدّمتها، والمعسكر الذي شاركت في تنظيمه، وتدريب بنك مصر، ومشروع تخرجي، والسباقات — مع البوستات الرسمية التي أعلنتها. كل صورة مكتوب معها ما هي ومتى وأين.",
  statPhotos: "صورة",
  statRaces: "بوست رسمي",
  filterLabel: "تصفية الصور حسب الموضوع",
  filters: {
    all: "الكل",
    athletics: "ألعاب القوى",
    teaching: "التدريس",
    community: "المجتمع والفعاليات",
    internship: "تدريب بنك مصر",
    university: "الجامعة",
  },
  openPhoto: "افتح",
  openPhotoAfter: "بالحجم الكامل",
  source: "المصدر:",
  showMore: "عرض المزيد",
  certsBefore: "تبحث عن الشهادات؟ كل",
  certsLink: "{certs} وثيقة",
  certsAfter: "في صفحتها الخاصة.",
};
