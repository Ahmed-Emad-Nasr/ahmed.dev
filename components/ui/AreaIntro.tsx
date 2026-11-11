/*
 * AreaIntro — the opening of a group of sections: a section header and a
 * row of jump links to the sections in the group. Server-rendered; the links
 * are plain #anchors (lib/perf/PageEffects.tsx mounts lazy targets before
 * jumping).
 *
 * ═══ components/ui/AreaIntro.tsx — area heading + row of jump links ═══
 * Used for the blog part of the home page (#blog). Props: titleA / titleB /
 * description (passed to SectionHeader), and
 * links = [{ href: "#section-id", label: "Text", n?: count }].
 */

import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/ui/FadeIn";

type AreaLink = { href: string; label: string; n?: number };

export default function AreaIntro({
  id,
  titleA,
  titleB,
  description,
  links,
}: {
  id: string;
  titleA: string;
  titleB: string;
  description: string;
  links: AreaLink[];
}) {
  return (
    <header id={id} className="relative pt-24 md:pt-32 pb-4 px-6 md:px-20 bg-background scroll-mt-24">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader titleA={titleA} titleB={titleB} description={description} />
        <FadeIn as="nav" y={16} duration={0.6} delay={0.1} aria-label={`${titleA} ${titleB}`.replace(/\.$/, "") + " — sections"} className="-mt-8 md:-mt-10 flex flex-wrap items-center gap-2">
          {links.map((j) => (
            <a
              key={j.href}
              href={j.href}
              className="group inline-flex items-center gap-2 border border-foreground/10 bg-foreground/[0.03] px-3.5 py-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors duration-180 hover:border-primary hover:text-foreground"
            >
              {j.label}
              {j.n !== undefined && <span className="text-accent tabular-nums">{j.n}</span>}
            </a>
          ))}
        </FadeIn>
      </div>
    </header>
  );
}
