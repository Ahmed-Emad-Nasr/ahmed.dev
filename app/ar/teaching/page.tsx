/*
 * ═══ app/ar/teaching/page.tsx — the TEACHING page in Arabic  ( URL: /ar/teaching ) ═══
 *
 * The same page as /teaching, in Arabic, for the students and training
 * centres that search in Arabic ("مدرب أمن سيبراني", "كورس سايبر سيكيورتي",
 * "دبلومة SOC"). Same sections and components as the English page; the
 * words come from data/teaching-ar.ts. The students' notes stay in the
 * language they were written in.
 *
 * The two pages point at each other (hreflang alternates below and in
 * app/teaching/page.tsx, and the language link at the top of each), so
 * Google shows each language to its own searchers instead of treating them
 * as duplicates. The navbar and the footer stay in English.
 */

import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import PageEffects from "@/lib/perf/PageEffects";
import SlashDivider from "@/components/ui/SlashDivider";
import { StudentFeedback, TeachingSection } from "@/components/home/dynamic";
import { TEACHING_AR, TEACHING_AR_PAGE } from "@/data/teaching-ar";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { TEACHING_AR_ID, TEACHING_AR_URL, TEACHING_LANGUAGES, TEACHING_URL } from "@/lib/page-ids";
import { arabicFont } from "@/app/ar/fonts";

const { title: TITLE, description: DESCRIPTION } = TEACHING_AR_PAGE;

/* The teaching page's share card (npm run og:cases), else the site card */
const SHARE_IMAGE = pageShareImage("teaching", "أحمد عماد نصر — مدرب أمن سيبراني");

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.teachingAr, KEYWORDS.teaching),
  alternates: { canonical: "/ar/teaching", languages: TEACHING_LANGUAGES },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: TEACHING_AR_URL,
    type: "website",
    siteName: "Ahmed Emad Nasr",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@0x3omda",
    creator: "@0x3omda",
    images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
  },
};

/* JSON-LD: the Arabic page, about the same course as the English one */
function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": TEACHING_AR_ID,
        url: TEACHING_AR_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "ar",
        keywords: KEYWORDS.teachingAr.join("، "),
        about: PERSON_REF,
        author: PERSON_REF,
        isPartOf: { "@id": WEBSITE_ID },
        /* The course itself is described once, on the English page */
        mainEntity: { "@id": `${TEACHING_URL}#course` },
        translationOfWork: { "@id": `${TEACHING_URL}#teaching` },
      },
      breadcrumbs([
        ["أحمد عماد نصر", absoluteUrl("/")],
        ["التدريس", TEACHING_AR_URL],
      ]),
    ],
  });
}

export default function ArabicTeachingPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* No UI: #anchor jumps (lib/perf/PageEffects.tsx) */}
      <PageEffects />

      {/* lang + dir: Arabic, right to left; the Cairo font (app/ar/fonts.ts)
          and the .lang-ar rules in globals.css */}
      <div lang="ar" dir="rtl" className={`lang-ar ${arabicFont.variable}`}>
        {/* pt: room for the fixed navbar */}
        <div className="pt-12 md:pt-16">
          {/* Same frame as the sections below: padding outside, max width inside */}
          <div className="relative z-10 px-6 md:px-20 pt-10 md:pt-12 -mb-10 md:-mb-14">
            <p className="max-w-7xl mx-auto">
              <Link
                href="/teaching"
                prefetch={false}
                hrefLang="en"
                lang="en"
                dir="ltr"
                className="inline-flex min-h-6 items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground/70 hover:text-primary-ink transition-colors"
              >
                {TEACHING_AR_PAGE.switchToEnglish} →
              </Link>
            </p>
          </div>
          <TeachingSection content={TEACHING_AR} />
        </div>

        <SlashDivider label="01 // آراء" japanese="受講生" origin="right" />
        <div className="tone-blue">
          <StudentFeedback copy={TEACHING_AR_PAGE.feedback} />
        </div>
      </div>
    </PageShell>
  );
}
