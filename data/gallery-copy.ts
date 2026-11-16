/*
 * ═══ data/gallery-copy.ts — the words of the gallery pages ═══
 *
 *   GALLERY_EN → /gallery      GALLERY_AR → /ar/gallery
 *
 * Drawn by components/gallery/ArtGallery.tsx. The certificates and photos
 * themselves (titles, issuers, summaries) come from data/certifications.ts
 * and data/portfolio-data.ts and stay as they are written there.
 *
 * Plain text only (the gallery runs in the browser, so no functions here):
 * {certs}, {professional} and {photos} are replaced with the counts.
 * A change to one language should be made in the other as well.
 */

export type GalleryCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  /** {certs} = documents, {photos} = photos */
  description: string;
  statCerts: string;
  statPhotos: string;
  listEyebrow: string;
  listTitleA: string;
  listTitleB: string;
  /** {certs} = documents, {professional} = certifications passed by exam */
  listText: string;
  filterLabel: string;
  filters: { all: string; certifications: string; education: string; courses: string; exams: string; badges: string };
  viewScan: string;
  /** "Verify with" + the issuer */
  verifyWith: string;
  opensIssuer: string;
  archiveEyebrow: string;
  archiveTitleA: string;
  archiveTitleB: string;
  /** {photos} = photos */
  archiveText: string;
  /** "Open" + the photo's title + "in lightbox" */
  openPhoto: string;
  openPhotoAfter: string;
  visualEntry: string;
  showMore: string;
  /** Lightbox caption: "Topics:" + the keywords */
  topics: string;
};

export const GALLERY_EN: GalleryCopy = {
  eyebrow: "Ahmed Emad Nasr // Certificates",
  titleA: "Proof",
  titleB: "Gallery.",
  description:
    "The proof behind everything on this site: my degree and {certs} certificates, courses and records, then {photos} photos from classrooms and events. Click any of them to see it full size.",
  statCerts: "Certifications passed",
  statPhotos: "Photos indexed",
  listEyebrow: "The full list // certifications, courses & records",
  listTitleA: "All",
  listTitleB: "Credentials.",
  listText:
    "Everything on paper ({certs} documents), sorted by what it really is: {professional} professional certifications passed by exam, then my degree and programmes, courses and training, exam score reports and the badges that verify them. Each card says who issued it and what it covers — click one to see the original document.",
  filterLabel: "Filter certificates by category",
  filters: {
    all: "Everything",
    certifications: "Certifications",
    education: "Degree & Programs",
    courses: "Courses & Training",
    exams: "Exam Scores",
    badges: "Verified Badges",
  },
  viewScan: "View scan",
  verifyWith: "Verify with",
  opensIssuer: "(opens the issuer's site)",
  archiveEyebrow: "Classes & events",
  archiveTitleA: "Visual",
  archiveTitleB: "Archive.",
  archiveText:
    "Photos from the classes I taught, competitions and community events ({photos}). The certificate scans open from their cards above.",
  openPhoto: "Open",
  openPhotoAfter: "in lightbox",
  visualEntry: "Visual Entry",
  showMore: "Show more",
  topics: "Topics:",
};

export const GALLERY_AR: GalleryCopy = {
  eyebrow: "أحمد عماد نصر // الشهادات",
  titleA: "معرض",
  titleB: "الإثبات.",
  description:
    "الدليل على كل ما في هذا الموقع: شهادتي الجامعية و{certs} شهادة ودورة ووثيقة، ثم {photos} صورة من قاعات التدريس والفعاليات. اضغط على أي منها لتراها بالحجم الكامل.",
  statCerts: "شهادة احترافية",
  statPhotos: "صورة",
  listEyebrow: "القائمة الكاملة // شهادات ودورات ووثائق",
  listTitleA: "كل",
  listTitleB: "الشهادات.",
  listText:
    "كل ما هو موثّق على الورق ({certs} وثيقة)، مرتّبًا حسب نوعه الحقيقي: {professional} شهادات احترافية اجتزتُ امتحاناتها، ثم الشهادة الجامعية والبرامج، والدورات والتدريب، وتقارير درجات الامتحانات، والشارات التي تثبتها. كل بطاقة تذكر الجهة المانحة وما تغطيه — اضغط عليها لترى الوثيقة الأصلية.",
  filterLabel: "تصفية الشهادات حسب النوع",
  filters: {
    all: "الكل",
    certifications: "شهادات احترافية",
    education: "الشهادة الجامعية والبرامج",
    courses: "دورات وتدريب",
    exams: "درجات الامتحانات",
    badges: "شارات موثّقة",
  },
  viewScan: "عرض الوثيقة",
  verifyWith: "تحقّق لدى",
  opensIssuer: "(يفتح موقع الجهة المانحة)",
  archiveEyebrow: "محاضرات وفعاليات",
  archiveTitleA: "الأرشيف",
  archiveTitleB: "المصوّر.",
  archiveText: "صور من المحاضرات التي قدّمتها والمسابقات والفعاليات المجتمعية ({photos}). صور الشهادات تُفتح من بطاقاتها في الأعلى.",
  openPhoto: "افتح",
  openPhotoAfter: "بالحجم الكامل",
  visualEntry: "صورة",
  showMore: "عرض المزيد",
  topics: "الموضوعات:",
};
