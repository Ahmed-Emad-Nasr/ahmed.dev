/*
 * ═══ lib/certificates-ld.ts — the structured data of the certificates ═══
 *
 * Server only (reads image sizes from public/): used by app/certificates
 * (the list, the Arabic list and each certificate's own page).
 *
 *   certificateCredentialLd(c) → EducationalOccupationalCredential: what it
 *       is, who issued it, when, the verification link and the scan.
 *   certificateImageLd(c)      → the scan's ImageObject (lib/image-meta.ts).
 */

import {
  CERTIFICATES,
  certificateAlt,
  certificateImagePath,
  certificateKeywords,
  certificatePagePath,
  certificateThumbPath,
  certificateWhen,
  type Certificate,
} from "@/data/certificates";
import { imageObject, imageSize } from "@/lib/image-meta";
import { absoluteUrl } from "@/lib/site";
import { PERSON_REF } from "@/lib/seo";

const CATEGORY: Record<Certificate["group"], string> = {
  certifications: "certification",
  education: "degree",
  courses: "certificate",
  exams: "assessment",
  badges: "badge",
};

/** Card picture sizes by slug, for <CertificateList sizes> */
export const CERTIFICATE_SIZES = Object.fromEntries(
  CERTIFICATES.flatMap((c) => {
    const s = imageSize(certificateThumbPath(c.slug)) ?? imageSize(certificateImagePath(c.slug));
    return s ? [[c.slug, s]] : [];
  }),
);

export const certificatePageUrl = (c: Certificate) => absoluteUrl(certificatePagePath(c.slug));

export const certificateImageLd = (c: Certificate) =>
  imageObject({
    id: `${certificatePageUrl(c)}#scan`,
    src: certificateImagePath(c.slug),
    thumb: certificateThumbPath(c.slug),
    name: `${c.title} — ${c.issuer}`,
    caption: certificateAlt(c),
    description: c.description,
    pageUrl: certificatePageUrl(c),
    keywords: certificateKeywords(c),
    creatorName: c.issuer,
    date: c.date,
    copyrightNotice: `Certificate issued by ${c.issuer} to Ahmed Emad Nasr.`,
  });

export const certificateCredentialLd = (c: Certificate) => ({
  "@type": "EducationalOccupationalCredential",
  "@id": `${certificatePageUrl(c)}#credential`,
  name: c.title,
  description: c.description,
  url: c.verifyUrl ?? certificatePageUrl(c),
  credentialCategory: CATEGORY[c.group],
  ...(c.date ? { dateCreated: c.date } : {}),
  ...(certificateWhen(c) ? { temporalCoverage: c.period ?? c.date } : {}),
  ...(c.hours ? { timeRequired: c.hours } : {}),
  ...(c.credentialId ? { identifier: c.credentialId } : {}),
  competencyRequired: c.covers.join(", "),
  keywords: certificateKeywords(c).join(", "),
  recognizedBy: { "@type": "Organization", name: c.issuer, ...(c.issuerUrl ? { url: c.issuerUrl } : {}) },
  ...(c.deliveredBy ? { provider: { "@type": "Organization", name: c.deliveredBy } } : {}),
  about: PERSON_REF,
  image: { "@id": `${certificatePageUrl(c)}#scan` },
  mainEntityOfPage: certificatePageUrl(c),
});
