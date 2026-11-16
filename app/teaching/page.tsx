/*
 * ═══ app/teaching/page.tsx — the TEACHING page  ( URL: /teaching ) ═══
 *
 * Everything about teaching in one place: the course written and taught,
 * where it was taught with the results, and what the students wrote.
 *
 *   Section on screen      Component                          Content / data
 *   ─────────────────────  ─────────────────────────────────  ──────────────────────────
 *   Teaching     #teaching components/home/TeachingSection    data/teaching.ts
 *   Feedback     #student-feedback components/home/StudentFeedback data/testimonials.ts (STUDENT_FEEDBACK)
 *
 * A section moved here from another page? Add its id to SECTION_PAGE in
 * lib/routes.ts, so the navbar, palette and shortcuts find it.
 */

import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import SlashDivider from "@/components/ui/SlashDivider";
import { StudentFeedback, TeachingSection } from "@/components/home/dynamic";
import { DIPLOMA } from "@/data/teaching";
import { OG_IMAGE, absoluteUrl } from "@/lib/site";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { TEACHING_ID, TEACHING_URL } from "@/lib/page-ids";

/* What a search result shows: the name first, so "Ahmed Emad Nasr
   instructor" and "Ahmed Emad Nasr teaching" match */
const DESCRIPTION =
  "Ahmed Emad Nasr, cybersecurity instructor at AMIT Learning and NTI: the 160-hour SOC & Cybersecurity Diploma he teaches, module by module, and what his students wrote.";
const TITLE = "Ahmed Emad Nasr — Cybersecurity Instructor & Teaching";

export const metadata: Metadata = {
  /* absolute: the name is already in it (no " | Ahmed Emad Nasr" template) */
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.teaching),
  alternates: { canonical: "/teaching" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: TEACHING_URL,
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

/* JSON-LD: the page, and the course it is about */
function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": TEACHING_ID,
        url: TEACHING_URL,
        name: TITLE,
        description: DESCRIPTION,
        keywords: KEYWORDS.teaching.join(", "),
        about: PERSON_REF,
        author: PERSON_REF,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": `${TEACHING_URL}#course` },
      },
      {
        "@type": "Course",
        "@id": `${TEACHING_URL}#course`,
        name: DIPLOMA.title,
        description: DIPLOMA.summary,
        timeRequired: `PT${DIPLOMA.hours}H`,
        inLanguage: ["ar", "en"],
        provider: PERSON_REF,
        instructor: PERSON_REF,
        syllabusSections: DIPLOMA.modules.map((m) => ({ "@type": "Syllabus", name: m.title, description: m.detail })),
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Teaching", TEACHING_URL],
      ]),
    ],
  });
}

export default function TeachingPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* No UI: #anchor jumps (lib/perf/PageEffects.tsx) */}
      <PageEffects />

      {/* pt: room for the fixed navbar */}
      <div className="pt-12 md:pt-16">
        <TeachingSection />
      </div>

      <SlashDivider label="01 // Feedback" japanese="受講生" origin="left" />
      <div className="tone-blue">
        <StudentFeedback />
      </div>
    </PageShell>
  );
}
