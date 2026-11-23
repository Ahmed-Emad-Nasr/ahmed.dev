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
import { StudentFeedback, TeachingSection } from "@/components/home/dynamic";
import { DIPLOMA } from "@/data/teaching";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { TEACHING_ID, TEACHING_LANGUAGES, TEACHING_URL } from "@/lib/page-ids";
import { TEACHING_AR_PAGE } from "@/data/teaching-ar";
import Link from "next/link";
import { X_HANDLE } from "@/lib/shared";

/* What a search result shows: the name first, so "Ahmed Emad Nasr
   instructor" and "Ahmed Emad Nasr teaching" match */
/* The audience line (AUDIENCE in lib/shared.ts) is added to the description */
const DESCRIPTION = withAudience(
  "Ahmed Emad Nasr, cybersecurity instructor at AMIT Learning and NTI: the 160-hour SOC & Cybersecurity Diploma he teaches, module by module, and what his students wrote",
  300,
);
const TITLE = "Ahmed Emad Nasr — Cybersecurity Instructor & Teaching";

/* This page's own share card (npm run og:cases), else the site card */
const SHARE_IMAGE = pageShareImage("teaching", "Ahmed Emad Nasr — cybersecurity instructor");

export const metadata: Metadata = {
  /* absolute: the name is already in it (no " | Ahmed Emad Nasr" template) */
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.teaching, KEYWORDS.audience),
  alternates: { canonical: "/teaching", languages: TEACHING_LANGUAGES },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: TEACHING_URL,
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
        {/* The same page in Arabic (app/ar/teaching/page.tsx) */}
        {/* Same frame as the sections below: padding outside, max width inside */}
        <div className="relative z-10 px-6 md:px-20 pt-10 md:pt-12 -mb-10 md:-mb-14">
          <p className="max-w-7xl mx-auto">
            <Link
              href="/ar/teaching"
              /* No prefetch: it would preload the Arabic font on this page */
              prefetch={false}
              hrefLang="ar"
              className="inline-flex min-h-6 items-center gap-2 text-sm text-foreground/70 hover:text-primary-ink transition-colors"
            >
              <bdi lang="ar">{TEACHING_AR_PAGE.switchToArabic}</bdi>
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
        <TeachingSection />
      </div>

      <div className="tone-blue">
        <StudentFeedback />
      </div>
    </PageShell>
  );
}
