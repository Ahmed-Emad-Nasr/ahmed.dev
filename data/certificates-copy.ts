/*
 * ═══ data/certificates-copy.ts — the words of the certificate pages ═══
 *
 *   CERTS_EN → /certificates      CERTS_AR → /ar/certificates
 *
 * Drawn by components/certificates/CertificateList.tsx. The certificates
 * themselves (titles, issuers, dates, details) come from data/certificates.ts
 * and stay as written there (they are the names printed on the documents).
 *
 * Plain text only (the list runs in the browser, so no functions here):
 * {all} = every document, {professional} = certifications passed by exam,
 * {verifiable} = documents with a verification link.
 * A change to one language should be made in the other as well.
 */

import type { CertificateGroup } from "@/data/certificates";

export type CertificatesCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  description: string;
  statAll: string;
  statProfessional: string;
  statVerifiable: string;
  filterLabel: string;
  filters: Record<CertificateGroup | "all", string>;
  /** Short line under each filter: what that group holds */
  groupNotes: Record<CertificateGroup | "all", string>;
  details: string;
  viewScan: string;
  verify: string;
  opensIssuer: string;
  /** "Issued by" on a card */
  issuedBy: string;
  galleryLink: string;
  galleryLinkText: string;
};

export const CERTS_EN: CertificatesCopy = {
  eyebrow: "Ahmed Emad Nasr // Certificates",
  titleA: "Every",
  titleB: "Certificate.",
  description:
    "Every certificate, degree, course and score report I hold — {all} original documents, with who issued each one, when, what it covers and how to verify it. Open any card for its full page; {verifiable} of them can be checked on the issuer's own site.",
  statAll: "Documents",
  statProfessional: "Certifications by exam",
  statVerifiable: "Verifiable online",
  filterLabel: "Filter certificates by type",
  filters: {
    all: "Everything",
    certifications: "Certifications",
    education: "Degree & Programs",
    courses: "Courses & Training",
    exams: "Exam Scores",
    badges: "Verified Badges",
  },
  groupNotes: {
    all: "Sorted by what each document really is.",
    certifications: "Professional certifications passed by exam.",
    education: "The degree, the internship and the long government and institute programmes.",
    courses: "Courses, learning paths, bootcamps and exam-prep training.",
    exams: "Score reports of graded exams.",
    badges: "Digital badges that verify a certificate.",
  },
  details: "Full details",
  viewScan: "View scan",
  verify: "Verify",
  opensIssuer: "(opens the issuer's site)",
  issuedBy: "Issued by",
  galleryLink: "Photos from classes, races and events are in the",
  galleryLinkText: "gallery",
};

export const CERTS_AR: CertificatesCopy = {
  eyebrow: "أحمد عماد نصر // الشهادات",
  titleA: "كل",
  titleB: "الشهادات.",
  description:
    "كل شهادة وشهادة جامعية ودورة وتقرير درجات أحملها — {all} وثيقة أصلية، مع الجهة المانحة لكل واحدة وتاريخها وما تغطيه وطريقة التحقق منها. افتح أي بطاقة لترى صفحتها الكاملة؛ و{verifiable} منها يمكن التحقق منها على موقع الجهة المانحة نفسها.",
  statAll: "وثيقة",
  statProfessional: "شهادة احترافية بامتحان",
  statVerifiable: "قابلة للتحقق أونلاين",
  filterLabel: "تصفية الشهادات حسب النوع",
  filters: {
    all: "الكل",
    certifications: "شهادات احترافية",
    education: "الشهادة الجامعية والبرامج",
    courses: "دورات وتدريب",
    exams: "درجات الامتحانات",
    badges: "شارات موثّقة",
  },
  groupNotes: {
    all: "مرتّبة حسب النوع الحقيقي لكل وثيقة.",
    certifications: "شهادات احترافية اجتزتُ امتحاناتها.",
    education: "الشهادة الجامعية والتدريب والبرامج الحكومية والمؤسسية الطويلة.",
    courses: "دورات ومسارات تعلّم ومعسكرات وتحضير للامتحانات.",
    exams: "تقارير درجات الامتحانات.",
    badges: "شارات رقمية تثبت الشهادات.",
  },
  details: "التفاصيل الكاملة",
  viewScan: "عرض الوثيقة",
  verify: "تحقّق",
  opensIssuer: "(يفتح موقع الجهة المانحة)",
  issuedBy: "الجهة المانحة",
  galleryLink: "صور المحاضرات والسباقات والفعاليات في",
  galleryLinkText: "معرض الصور",
};
