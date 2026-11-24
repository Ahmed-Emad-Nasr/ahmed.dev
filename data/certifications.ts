/*
 * Certifications (from the CV PDF): the professional-certification count on
 * the home page and the EducationalOccupationalCredential JSON-LD.
 *
 * ═══ data/certifications.ts — the formal list, as on the CV ═══
 *
 *   `certifications` → the formal list (as on the CV PDF): JSON-LD and the
 *   professional-certification count.
 *   Add one: { id, name, shortName?, issuer, year, verifyUrl?, certificate?,
 *   credential?: "exam" | "course" }.
 *   `certificate` = the slug of its scan in data/certificates.ts (every
 *   certificate, course, score report and badge, with all its details — the
 *   /certificates page).
 *
 *   The home page counts professional CERTIFICATIONS only
 *   (PROFESSIONAL_CERTIFICATION_COUNT): `credential: "course"` is left out.
 */

import { SITE_BASE_URL, absoluteUrl } from "@/lib/site";
import { certificateBySlug, certificateImagePath, certificatePagePath } from "@/data/certificates";

type Certification = {
  /** Stable id — used as the key and in the JSON-LD */
  id: string;
  /** Certification name exactly as written on it */
  name: string;
  /** The abbreviation people search for */
  shortName?: string;
  /** Issuing organisation */
  issuer: string;
  /** Year obtained */
  year: number;
  /** Verification link from the issuer itself */
  verifyUrl?: string;
  /** Its scan in data/certificates.ts (slug), if there is one */
  certificate?: string;
  /** "exam" = passed a proctored/graded exam; "course" = completion of a
      course or learning path. Left out where it isn't certain. */
  credential?: "exam" | "course";
};

/** Ordered newest to oldest — same order as the CV */
/* Order and wording follow the CV PDF. */
const certifications: readonly Certification[] = [
  { id: "ejpt-v2", credential: "exam", name: "eLearnSecurity Junior Penetration Tester v2", shortName: "eJPT v2", issuer: "INE", year: 2026, certificate: "ejpt-junior-penetration-tester-ine-security" },
  { id: "ccep", credential: "exam", name: "Certified Cybersecurity Educator Professional", shortName: "CCEP", issuer: "Red Team Leaders", year: 2026, certificate: "ccep-certified-cybersecurity-educator-professional" },
  { id: "rh124", credential: "course", name: "Red Hat System Administration I (RH124)", shortName: "RH124", issuer: "Red Hat", year: 2026, certificate: "red-hat-system-administration-1-rh124" },
  /* Huawei: the documents are course certificates ("does not represent
     passing the Huawei Certification exam", printed on them) */
  { id: "hcia-datacom", credential: "course", name: "HCIA-Datacom V1.0 & HCCDA-Tech Essentials", shortName: "HCIA-Datacom", issuer: "Huawei", year: 2025, certificate: "huawei-hcia-datacom-v1-course" },
  { id: "thm-soc-l1-l2", credential: "course", name: "SOC Level 1 & SOC Level 2 Learning Paths", issuer: "TryHackMe", year: 2025, certificate: "tryhackme-soc-level-2-learning-path" },
  /* The certificate prints the completion date 21/06/23 */
  { id: "malware-analysis-fundamentals", credential: "course", name: "Malware Analysis Fundamentals", issuer: "Mahara-Tech (ITI)", year: 2023, certificate: "mahara-tech-malware-analysis-fundamentals" },
  /* "passed the arcX course examination … awarded the arcX Foundation Level
     Threat Intelligence Analyst Certification" */
  { id: "cti-101", credential: "exam", name: "Cyber Threat Intelligence 101", issuer: "arcX", year: 2025, certificate: "arcx-cyber-threat-intelligence-101-foundation-certification" },
  { id: "ccna", credential: "exam", name: "Cisco Certified Network Associate (CCNA 200-301)", shortName: "CCNA", issuer: "Cisco Systems", year: 2024 /* no scan of the CCNA certificate itself yet (the 98% practice exam is on /certificates) — add `certificate` or verifyUrl when uploaded */ },
  { id: "hcia-cloud", credential: "course", name: "HCIA-Cloud Computing V5.0", shortName: "HCIA-Cloud", issuer: "Huawei", year: 2024, certificate: "huawei-hcia-cloud-computing-v5-course" },
];

/* The scan's verification link and picture, from data/certificates.ts */
const scanOf = (cert: Certification) => (cert.certificate ? certificateBySlug(cert.certificate) : undefined);

export const certificationsJsonLd = (personId: string) =>
  certifications.map((cert) => {
    const scan = scanOf(cert);
    const url = cert.verifyUrl ?? scan?.verifyUrl ?? (scan ? absoluteUrl(certificatePagePath(scan.slug)) : undefined);
    return {
      "@type": "EducationalOccupationalCredential",
      name: cert.name,
      ...(cert.shortName ? { alternateName: cert.shortName } : {}),
      /* The issuer's own verification page, else the certificate's page here */
      ...(url ? { url } : {}),
      ...(scan ? { image: `${SITE_BASE_URL}/${certificateImagePath(scan.slug)}` } : {}),
      credentialCategory: cert.credential === "course" ? "certificate" : "certification",
      educationalLevel: "professional",
      dateCreated: String(cert.year),
      recognizedBy: { "@type": "Organization", name: cert.issuer },
      about: { "@id": personId },
    };
  });

/** Professional certifications (not courses) — the CV list minus course completions */
export const PROFESSIONAL_CERTIFICATION_COUNT = certifications.filter((c) => c.credential !== "course").length;
