/*
 * ═══ app/training/page.tsx — cybersecurity training for a team  ( URL: /training ) ═══
 *
 * The page for whoever books training — a company SOC team, a university, a
 * training centre: who it is for, the ways to take it, the SOC &
 * Cybersecurity Diploma module by module, what students said, and one
 * button that opens the visitor's mail app with a ready request.
 * The same page in Arabic: app/ar/training/page.tsx.
 *
 * Where the text lives:
 *   the words of the page               → data/training.ts (TRAINING_EN)
 *   the diploma (modules, hours …)      → data/teaching.ts (DIPLOMA)
 *   the student quotes                  → data/testimonials.ts
 *   the layout                          → components/training/TrainingContent.tsx
 */

import PageShell from "@/components/layout/PageShell";
import TrainingContent from "@/components/training/TrainingContent";
import { TRAINING_EN } from "@/data/training";
import { DIPLOMA } from "@/data/teaching";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { TEACHING_URL, TRAINING_ID, TRAINING_LANGUAGES, TRAINING_URL } from "@/lib/page-ids";

const { title: TITLE } = TRAINING_EN;
/* The audience line (AUDIENCE in lib/shared.ts) is added to the description */
const DESCRIPTION = withAudience(TRAINING_EN.description, 400);

export const metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/training",
    keywords: pageKeywords(KEYWORDS.training, KEYWORDS.teaching, KEYWORDS.audience),
    share: pageShareImage("training", "Ahmed Emad Nasr — cybersecurity training for teams"),
  }),
  alternates: { canonical: "/training", languages: TRAINING_LANGUAGES },
};

function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": TRAINING_ID,
        url: TRAINING_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        about: PERSON_REF,
        mainEntity: { "@id": `${TRAINING_URL}#course` },
      },
      {
        "@type": "Course",
        "@id": `${TRAINING_URL}#course`,
        name: DIPLOMA.title,
        description: DIPLOMA.summary,
        url: TRAINING_URL,
        timeRequired: `PT${DIPLOMA.hours}H`,
        inLanguage: ["en", "ar"],
        educationalLevel: "Beginner to SOC Tier 1",
        provider: PERSON_REF,
        instructor: PERSON_REF,
        syllabusSections: DIPLOMA.modules.map((m) => ({ "@type": "Syllabus", name: m.title, description: m.detail })),
        hasCourseInstance: [
          { "@type": "CourseInstance", courseMode: "Onsite", location: { "@type": "Place", name: "Cairo, Egypt" }, instructor: PERSON_REF },
          { "@type": "CourseInstance", courseMode: "Onsite", location: { "@type": "Place", name: "Benha, Egypt" }, instructor: PERSON_REF },
          { "@type": "CourseInstance", courseMode: "Online", instructor: PERSON_REF },
        ],
        offers: { "@type": "Offer", category: "Paid", availability: "https://schema.org/InStock", url: TRAINING_URL },
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Teaching", TEACHING_URL],
        ["Training for teams", TRAINING_URL],
      ]),
    ],
  });
}

export default function TrainingPage() {
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      <TrainingContent copy={TRAINING_EN} />
    </PageShell>
  );
}
