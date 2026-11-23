/*
 * ═══ app/cv/page.tsx — the CV as a web page  ( URL: /cv ) ═══
 *
 * The same content as the PDF CV, as real text on a page: search engines
 * index it ("Ahmed Emad Nasr CV"), it opens on any phone without a PDF
 * viewer, and the PDF is one click away (Download PDF).
 *
 * The words come from data/cv.ts — update it whenever the PDF changes.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BriefcaseBusiness, Download, ExternalLink, Mail, Phone } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import PageShell from "@/components/layout/PageShell";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { KanjiWatermark, btnOutline, btnPrimary } from "@/components/ui/kit";
import { CV } from "@/data/cv";
import { normalizePublicHref, X_HANDLE } from "@/lib/shared";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords, withAudience } from "@/lib/seo";
import { CV_ID, CV_URL } from "@/lib/page-ids";

const TITLE = "Ahmed Emad Nasr — CV | Information Security Officer";
/* The audience line (AUDIENCE in lib/shared.ts) is added to the description */
const DESCRIPTION = withAudience(
  "CV of Ahmed Emad Nasr, information security officer and cybersecurity instructor in Egypt: experience at AMIT Learning, Banque Misr and DEPI, SOC, DFIR, GRC and malware-analysis projects, skills and certifications (eJPT, CCNA)",
  300,
);

/* The CV's own share card (npm run og:cases), else the site card */
const SHARE_IMAGE = pageShareImage("cv", "Ahmed Emad Nasr — CV");

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: pageKeywords(KEYWORDS.cv),
  alternates: { canonical: "/cv" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CV_URL,
    type: "profile",
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

/* JSON-LD: a profile page about the person (who is described in full on
   the home page), with the PDF as its downloadable version */
function structuredData() {
  return jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": CV_ID,
        url: CV_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: PERSON_REF,
        about: PERSON_REF,
        encoding: {
          "@type": "MediaObject",
          contentUrl: absoluteUrl(`/${CV.pdf}`),
          encodingFormat: "application/pdf",
          name: "Ahmed Emad Nasr — CV (PDF)",
        },
      },
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["CV", CV_URL],
      ]),
    ],
  });
}

/* "**bold**" in data/cv.ts → <strong> (the numbers, as in the PDF) */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <FadeIn as="section" aria-labelledby={id} y={24} className="mt-14">
      <h2 id={id} className="mb-6 flex items-center gap-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">
        <span className="w-12 h-[2px] bg-primary" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </FadeIn>
  );
}

function Entry({ title, org, place, dates, points }: { title: string; org: string; place: string; dates: string; points: string[] }) {
  return (
    <div className="border-s border-foreground/10 ps-6 pb-8 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tight leading-tight">{title}</h3>
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary">{dates}</span>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        <span className="font-medium text-foreground/85">{org}</span> · {place}
      </p>
      <ul className="mt-3 space-y-2 list-disc ps-5 marker:text-primary text-sm md:text-[0.9375rem] text-foreground/70 font-light leading-relaxed">
        {points.map((p) => (
          <li key={p}>
            <Rich text={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CvPage() {
  const pdf = normalizePublicHref(CV.pdf);
  const { contact, education } = CV;
  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData() }} />
      <article className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars="履歴" side="right" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* ─── Header ─── */}
          <header>
            <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-primary-ink">Curriculum Vitae</p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Ahmed Emad Nasr
            </h1>
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-tertiary">{CV.headline}</p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/70" aria-label="Contact">
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="inline-flex min-h-6 items-center gap-2 hover:text-primary-ink transition-colors">
                  <Phone size={14} aria-hidden="true" /> {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex min-h-6 items-center gap-2 hover:text-primary-ink transition-colors">
                  <Mail size={14} aria-hidden="true" /> {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center gap-2 hover:text-primary-ink transition-colors">
                  <Linkedin size={14} /> linkedin.com/in/ahmed-emad-nasr
                </a>
              </li>
              <li>
                <a href={contact.wuzzuf} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center gap-2 hover:text-primary-ink transition-colors">
                  <BriefcaseBusiness size={14} aria-hidden="true" /> wuzzuf.net/me/ahmed-emad-nasr
                </a>
              </li>
              <li>
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center gap-2 hover:text-primary-ink transition-colors">
                  <Github size={14} /> github.com/Ahmed-Emad-Nasr
                </a>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={pdf} download className={btnPrimary}>
                <Download size={14} aria-hidden="true" /> Download PDF
              </a>
              <Link prefetch={false} href="/" className={btnOutline}>
                Portfolio
              </Link>
              <Link prefetch={false} href="/blog" className={btnOutline}>
                Case studies
              </Link>
            </div>
          </header>

          {/* ─── Education ─── */}
          <Section id="cv-education" title="Education">
            <div className="border-s border-foreground/10 ps-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tight leading-tight">{education.degree}</h3>
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-tertiary">{education.date}</span>
              </div>
              <p className="mt-1 text-sm text-foreground/70">
                <span className="font-medium text-foreground/85">{education.school}</span> · GPA{" "}
                <strong className="font-semibold text-foreground">{education.gpa}</strong> · {education.place}
              </p>
              <p className="mt-3 text-sm md:text-[0.9375rem] text-foreground/70 font-light leading-relaxed">
                Relevant coursework: {education.coursework}
              </p>
            </div>
          </Section>

          {/* ─── Experience ─── */}
          <Section id="cv-experience" title="Experience">
            {CV.experience.map((e) => (
              <Entry key={`${e.title}-${e.org}`} {...e} />
            ))}
          </Section>

          {/* ─── Projects ─── */}
          <Section id="cv-projects" title="Projects">
            {CV.projects.map((p) => (
              <div key={p.title} className="border-s border-foreground/10 ps-6 pb-8 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-lg md:text-xl font-black uppercase tracking-tight leading-tight">{p.title}</h3>
                  <span className="flex gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.15em]">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center gap-1.5 text-tertiary hover:text-primary-ink transition-colors">
                        GitHub <ExternalLink size={11} aria-hidden="true" />
                        <span className="sr-only">: {p.title}</span>
                      </a>
                    )}
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center gap-1.5 text-tertiary hover:text-primary-ink transition-colors">
                        Demo <ExternalLink size={11} aria-hidden="true" />
                        <span className="sr-only">: {p.title}</span>
                      </a>
                    )}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-foreground/60 leading-relaxed">{p.stack}</p>
                <ul className="mt-3 space-y-2 list-disc ps-5 marker:text-primary text-sm md:text-[0.9375rem] text-foreground/70 font-light leading-relaxed">
                  {p.points.map((pt) => (
                    <li key={pt}>
                      <Rich text={pt} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          {/* ─── Skills ─── */}
          <Section id="cv-skills" title="Skills">
            <dl className="grid grid-cols-1 gap-3">
              {CV.skills.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)] gap-x-6 gap-y-1">
                  <dt className="text-sm font-semibold text-foreground/90">{label}</dt>
                  <dd className="text-sm text-foreground/70 font-light">{value}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* ─── Certifications ─── */}
          <Section id="cv-certifications" title="Certifications">
            <ul className="space-y-2">
              {CV.certifications.map(([name, issuer, year]) => (
                <li key={name} className="flex flex-wrap items-baseline justify-between gap-x-6 text-sm">
                  <span>
                    <strong className="font-semibold text-foreground/90">{name}</strong>
                    <span className="text-foreground/60"> — {issuer}</span>
                  </span>
                  <span className="font-mono text-xs text-tertiary">{year}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm">
              <Link prefetch={false} href="/gallery" className="text-primary-ink hover:underline">
                See the original certificates →
              </Link>
            </p>
          </Section>

          {/* ─── Volunteering ─── */}
          <Section id="cv-volunteering" title="Volunteering">
            {CV.volunteering.map((e) => (
              <Entry key={`${e.title}-${e.org}`} {...e} />
            ))}
          </Section>

          {/* ─── Awards ─── */}
          <Section id="cv-awards" title="Awards & achievements">
            <ul className="space-y-2 list-disc ps-5 marker:text-primary text-sm md:text-[0.9375rem] text-foreground/70 font-light leading-relaxed">
              {CV.awards.map((a) => (
                <li key={a}>
                  <Rich text={a} />
                </li>
              ))}
            </ul>
          </Section>

          {/* ─── Languages ─── */}
          <Section id="cv-languages" title="Languages">
            <p className="text-sm text-foreground/70">
              {CV.languages.map(([lang, level], i) => (
                <span key={lang}>
                  {i > 0 && <span className="mx-3 text-foreground/30" aria-hidden="true">|</span>}
                  <strong className="font-semibold text-foreground/90">{lang}:</strong> {level}
                </span>
              ))}
            </p>
          </Section>

          <div className="mt-16 flex flex-wrap gap-3">
            <a href={pdf} download className={btnPrimary}>
              <Download size={14} aria-hidden="true" /> Download the CV (PDF)
            </a>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
