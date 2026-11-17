/*
 * ═══ app/projects/[id]/page.tsx — one tool I wrote  ( URL: /projects/<id> ) ═══
 *
 * /projects/cybersuite, /projects/webp-converter: what the tool does, how to
 * install and run it, a sample of its output, screenshots and the GitHub
 * link — so the tool shows up in search under its own name.
 *
 * Edit the text in data/tools.ts; the title, tagline, stack and GitHub link
 * come from the project's entry in data/portfolio-data.ts.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Terminal } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import BackCrumb from "@/components/layout/BackCrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/ui/FadeIn";
import { Github } from "@/components/ui/BrandIcons";
import { KanjiWatermark, btnOutline, cardSurface, chipNeutral, ctaPrimary } from "@/components/ui/kit";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { TOOL_PAGES, toolPageById } from "@/data/tools";
import { normalizePublicHref } from "@/lib/shared";
import { absoluteUrl } from "@/lib/site";
import { pageShareImage } from "@/lib/og";
import { pageMetadata } from "@/lib/page-meta";
import { KEYWORDS, PERSON_REF, WEBSITE_ID, breadcrumbs, jsonLd, pageKeywords } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return TOOL_PAGES.map((t) => ({ id: t.id }));
}

function find(id: string) {
  const tool = toolPageById(id);
  const project = PORTFOLIO_DATA.work.find((w) => w.id === id);
  if (!tool || !project) return null;
  const title = `${project.title} — ${project.tagline.replace(/\.$/, "")} | Ahmed Emad Nasr`;
  const description = `${project.title}, an open-source ${project.stack[0]} tool by Ahmed Emad Nasr. ${project.tagline} What it does, how to install and run it, and the code on GitHub.`;
  return { tool, project, title, description };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const found = find((await params).id);
  if (!found) return { title: "Tool not found" };
  const { project, title, description } = found;
  return pageMetadata({
    title,
    description,
    path: `/projects/${project.id}`,
    keywords: pageKeywords([project.title, `${project.title} GitHub`, ...project.stack], KEYWORDS.tools),
    share: pageShareImage(`tool-${project.id}`, `${project.title} — Ahmed Emad Nasr`),
  });
}

/* "# a comment" lines in the install steps are drawn dimmer */
const isComment = (line: string) => line.startsWith("#");

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const found = find((await params).id);
  if (!found) notFound();
  const { tool, project, title, description } = found;
  const url = absoluteUrl(`/projects/${project.id}`);
  const github = project.links.github;

  const structuredData = jsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": `${url}#software` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name: project.title,
        description: tool.about,
        url,
        applicationCategory: project.id === "cybersuite" ? "SecurityApplication" : "MultimediaApplication",
        operatingSystem: tool.os,
        softwareRequirements: tool.requirements.join(", "),
        featureList: tool.features,
        author: PERSON_REF,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        ...(tool.license ? { license: `https://opensource.org/licenses/${tool.license}` } : {}),
        ...(github ? { sameAs: github } : {}),
        ...(tool.screenshots?.length ? { screenshot: tool.screenshots.map((s) => absoluteUrl(s.src)) } : {}),
      },
      ...(github
        ? [
            {
              "@type": "SoftwareSourceCode",
              "@id": `${url}#code`,
              name: project.title,
              codeRepository: github,
              programmingLanguage: project.stack[0],
              author: PERSON_REF,
              targetProduct: { "@id": `${url}#software` },
            },
          ]
        : []),
      breadcrumbs([
        ["Ahmed Emad Nasr", absoluteUrl("/")],
        ["Projects", absoluteUrl("/#projects")],
        [project.title, url],
      ]),
    ],
  });

  const others = TOOL_PAGES.filter((t) => t.id !== project.id).flatMap((t) => {
    const p = PORTFOLIO_DATA.work.find((w) => w.id === t.id);
    return p ? [p] : [];
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <article className="relative px-6 md:px-20 pt-36 md:pt-44 pb-24 overflow-hidden">
        <KanjiWatermark chars={tool.japanese} side="right" />
        <div className="max-w-6xl mx-auto relative z-10">
          <BackCrumb href="/#projects" label="All projects" current="Tool" />
          <SectionHeader
            as="h1"
            eyebrow={`Ahmed Emad Nasr // Open-source tool · ${project.platform} · ${project.year}`}
            japanese={tool.japanese}
            titleA={project.title}
            titleB={tool.headline}
            size="default"
            className="[&_h1]:[overflow-wrap:anywhere] [&_h1]:hyphens-auto"
            description={tool.about}
            aside={
              github ? (
                <a href={github} target="_blank" rel="noopener noreferrer" className={ctaPrimary}>
                  <Github size={16} /> The code on GitHub
                  <span className="sr-only"> (opens GitHub)</span>
                </a>
              ) : undefined
            }
          />

          <ul className="mb-16 flex flex-wrap gap-2" aria-label="Built with">
            {project.stack.map((s) => (
              <li key={s} className={chipNeutral}>
                {s}
              </li>
            ))}
          </ul>

          {tool.screenshots && tool.screenshots.length > 0 && (
            <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Screenshots">
              {tool.screenshots.map((s) => (
                <figure key={s.src} className="relative aspect-video overflow-hidden border border-foreground/10 bg-surface">
                  <Image src={normalizePublicHref(s.src)} alt={s.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-top" />
                </figure>
              ))}
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FadeIn className={`${cardSurface} p-7 md:p-9`}>
              <h2 className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">What it does</h2>
              <ul className="mt-6 space-y-3">
                {tool.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm md:text-[0.9375rem] text-foreground/80 leading-relaxed">
                    <Check size={16} className="mt-0.5 shrink-0 text-primary-ink" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <h2 className="mt-10 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">You need</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tool.requirements.map((r) => (
                  <li key={r} className={chipNeutral}>
                    {r}
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.1} className="flex flex-col gap-8 min-w-0">
              <section className={`${cardSurface} p-7 md:p-9`} aria-labelledby="tool-install">
                <h2 id="tool-install" className="flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-primary-ink">
                  <Terminal size={14} aria-hidden="true" /> Install and run
                </h2>
                {/* tabIndex: a box that scrolls sideways must be reachable by keyboard */}
                <pre tabIndex={0} aria-label="Install commands" className="mt-6 overflow-x-auto bg-background border border-foreground/10 p-5 font-mono text-xs leading-relaxed">
                  <code>
                    {tool.install.map((line) => (
                      <span key={line} className={`block ${isComment(line) ? "text-foreground/45" : "text-foreground/85"}`}>
                        {isComment(line) ? line : `$ ${line}`}
                      </span>
                    ))}
                  </code>
                </pre>
                {tool.examples && tool.examples.length > 0 && (
                  <dl className="mt-6 space-y-4">
                    {tool.examples.map((e) => (
                      <div key={e.command}>
                        <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">{e.label}</dt>
                        <dd tabIndex={0} className="mt-1.5 overflow-x-auto">
                          <code className="block whitespace-pre font-mono text-xs text-foreground/85">$ {e.command}</code>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>

              {tool.sampleOutput && (
                <section className={`${cardSurface} p-7 md:p-9`} aria-labelledby="tool-output">
                  <h2 id="tool-output" className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-tertiary">
                    What it prints
                  </h2>
                  <pre tabIndex={0} aria-label="Sample output" className="mt-6 overflow-x-auto bg-background border border-foreground/10 p-5 font-mono text-xs leading-relaxed text-foreground/80">
                    <code>{tool.sampleOutput}</code>
                  </pre>
                </section>
              )}
            </FadeIn>
          </div>

          {others.length > 0 && (
            <nav className="mt-24 flex flex-wrap items-center gap-4" aria-label="Other tools">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-foreground/60">More tools:</span>
              {others.map((p) => (
                <Link key={p.id} prefetch={false} href={`/projects/${p.id}`} className={btnOutline}>
                  {p.title}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </article>
    </PageShell>
  );
}
