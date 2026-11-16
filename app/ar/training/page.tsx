/*
 * ═══ app/ar/training/page.tsx — /training in Arabic  ( URL: /ar/training ) ═══
 *
 * The same page as app/training/page.tsx, right to left, for companies and
 * training centres in Egypt that search in Arabic. The two pages name each
 * other (hreflang), so Google shows each one to its language.
 *
 * The words: data/training.ts (TRAINING_AR). The layout is shared:
 * components/training/TrainingContent.tsx.
 */

import PageShell from "@/components/layout/PageShell";
import TrainingContent from "@/components/training/TrainingContent";
import { TRAINING_AR } from "@/data/training";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";
import { TEACHING_AR_URL, TRAINING_AR_ID, TRAINING_AR_URL, TRAINING_LANGUAGES, TRAINING_URL } from "@/lib/page-ids";
import { arabicFont } from "@/app/ar/fonts";

const { title: TITLE, description: DESCRIPTION } = TRAINING_AR;

const base = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/ar/training",
  keywords: pageKeywords(KEYWORDS.trainingAr, KEYWORDS.teachingAr),
  share: pageShareImage("training", "أحمد عماد نصر — تدريب أمن سيبراني للفرق"),
});

export const metadata = {
  ...base,
  alternates: { canonical: "/ar/training", languages: TRAINING_LANGUAGES },
  openGraph: { ...base.openGraph, locale: "ar_EG", alternateLocale: ["en_US"] },
};

function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": TRAINING_AR_ID,
        url: TRAINING_AR_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "ar",
        isPartOf: { "@id": WEBSITE_ID },
        about: PERSON_REF,
        /* The course itself is described once, on the English page */
        mainEntity: { "@id": `${TRAINING_URL}#course` },
        translationOfWork: { "@id": `${TRAINING_URL}#training` },
      },
      breadcrumbs([
        ["أحمد عماد نصر", absoluteUrl("/")],
        ["التدريس", TEACHING_AR_URL],
        ["تدريب الفرق", TRAINING_AR_URL],
      ]),
    ],
  });
}

export default function ArabicTrainingPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      {/* lang + dir: Arabic, right to left; the Cairo font (app/ar/fonts.ts) and .lang-ar in globals.css */}
      <div lang="ar" dir="rtl" className={`lang-ar ${arabicFont.variable}`}>
        <TrainingContent copy={TRAINING_AR} />
      </div>
    </PageShell>
  );
}
