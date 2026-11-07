import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { CardEffects, TiltCard } from "@/components/ui/Motion";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Award,
  FolderSearch,
} from "lucide-react";
import CaseFilterLink from "@/components/blog/CaseFilterLink";
import FadeIn from "@/components/ui/FadeIn";
import Logo from "@/components/ui/Logo";

const KIND_LABEL = { work: "Job", volunteer: "Volunteer", education: "Education" } as const;

/* "Information Technology Institute (ITI)" → the name, plus "ITI" as a chip */
const splitName = (company: string) => {
  const m = /^(.*?)\s*\(([^)]+)\)$/.exec(company);
  return m ? { name: m[1], short: m[2] } : { name: company, short: undefined };
};

/* The display face is wide: size the name by its longest word so a word
   never has to break in the middle ("Informatio-n") */
const nameSize = (name: string) => {
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length));
  if (longest >= 14) return "text-[1.25rem] sm:text-2xl md:text-[1.75rem] lg:text-[1.375rem] xl:text-3xl";
  if (longest >= 9 || name.length > 18) return "text-2xl sm:text-3xl md:text-[2rem] lg:text-3xl xl:text-4xl";
  return "text-3xl md:text-5xl";
};

export default function ExperienceTimeline() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      {/* ─── Background Decorative Kanji ─── */}
      <div
        className="absolute top-20 right-10 pointer-events-none select-none text-foreground/[0.03] text-[15vw] font-black z-0 vertical-text uppercase"
        aria-hidden="true"
        role="img"
      >
        <span>職</span>
        <span>歴</span>
        <span>経</span>
        <span>験</span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ─── Section Header ─── */}
        <div className="exp-header mb-16 md:mb-20">
          <FadeIn
            as="h2"
            y={40}
            duration={1}
            delay={0.15}
            className="font-display title-fit [--title-n:12] font-black tracking-tighter uppercase leading-[0.85]"
          >
            <span className="text-foreground">Professional</span> <br />
            <span className="text-primary italic">Experience.</span>
          </FadeIn>
          <FadeIn
            y={40}
            duration={1}
            delay={0.3}
            className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed"
          >
            Where I have worked, trained and studied — newest first. Each card
            says what the place is, what I did there in one line, and the
            results; the certificate and the related case studies are one
            click away.
          </FadeIn>
        </div>

        {/* ─── Experience Cards ─── */}
        <div className="flex flex-col gap-14 md:gap-20">
          {PORTFOLIO_DATA.experience.map((item, idx) => (
            <FadeIn
              x={idx % 2 === 0 ? -100 : 100}
              y={0}
              duration={1.2}
              key={idx}
              className="exp-item group relative grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-10 lg:gap-16 items-start"
            >
              {/* Left Column: Metadata */}
              <div className="flex flex-col gap-4">
                {/* Period */}
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Calendar size={14} strokeWidth={2} />
                  <span className="font-mono text-xs tracking-[0.15em] font-bold uppercase text-foreground/60">
                    {item.period}
                  </span>
                </div>

                {/* Role */}
                <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-accent">
                  {item.role}
                </span>

                {/* Company: logo + name. Words wrap whole; the abbreviation
                    in brackets becomes a chip under the name. */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex flex-col items-start gap-4 w-full min-w-0"
                >
                  <Logo name={item.company} size={56} className="transition-transform duration-500 group-hover/link:-translate-y-0.5" />
                  <div className="flex w-full items-start gap-3">
                    <h3
                      className={`min-w-0 font-display font-black leading-[1.05] text-foreground group-hover/link:text-primary transition-colors duration-500 [hyphens:manual] [text-wrap:balance] ${nameSize(splitName(item.company).name)}`}
                    >
                      {splitName(item.company).name}
                      {splitName(item.company).short && <span className="sr-only"> ({splitName(item.company).short})</span>}
                    </h3>
                    <ExternalLink
                      size={18}
                      className="mt-1 shrink-0 text-foreground/15 group-hover/link:text-primary-ink transition-colors duration-300"
                    />
                  </div>
                </a>

                {/* Location + what kind of entry this is */}
                <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-sm font-mono">
                  <span className="flex items-center gap-2">
                    <MapPin size={12} strokeWidth={2} />
                    <span className="text-xs">{item.location}</span>
                  </span>
                  {splitName(item.company).short && (
                    <span className="px-2 py-0.5 border border-primary/30 text-[0.5625rem] font-bold uppercase tracking-[0.25em] text-primary-ink" aria-hidden="true">
                      {splitName(item.company).short}
                    </span>
                  )}
                  {item.kind && (
                    <span className="px-2 py-0.5 border border-foreground/15 text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
                      {KIND_LABEL[item.kind]}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Service Record Panel */}
              <TiltCard className="spotlight relative bg-surface/60 border border-foreground/5 backdrop-blur-sm group-hover:border-primary/20 transition-all duration-700 overflow-hidden">
                <CardEffects index={idx + 1} />
                {/* Red left accent border */}
                <div className="absolute top-0 left-0 w-[3px] h-full bg-primary" />

                {/* Large Index Number */}
                <div
                  className="absolute top-6 right-6 font-mono text-7xl md:text-8xl font-black text-foreground/[0.04] leading-none select-none group-hover:text-primary/10 transition-colors duration-700"
                  aria-hidden="true"
                  data-deco={`0${idx + 1}`}
                />

                {/* Panel Header */}
                <div className="relative z-10 px-6 md:px-12 pt-6 md:pt-8 pb-4 border-b border-foreground/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent" />
                    <span className="font-mono text-[0.5625rem] text-foreground/60 tracking-[0.3em] uppercase">
                      In short
                    </span>
                  </div>
                  <span className="font-mono text-[0.5625rem] text-foreground/60 tracking-wider uppercase">
                    {item.period.split("–")[0]?.trim()}
                  </span>
                </div>

                {/* Description */}
                <div className="relative z-10 px-6 md:px-12 py-6 md:py-8">
                  <p className="text-base md:text-lg font-light text-foreground/80 leading-relaxed border-l-2 border-foreground/10 pl-5 italic">
                    {item.description}
                  </p>
                </div>

                {/* Horizontal Rule */}
                <div className="mx-6 md:mx-12 h-[1px] bg-foreground/5" />

                {/* Details Checklist */}
                <div className="relative z-10 px-6 md:px-12 py-6 md:py-8 flex flex-col gap-0">
                  {item.details.map((detail, i) => (
                    <div key={i}>
                      <div className="flex items-start gap-4 group/detail py-3">
                        {/* Custom bullet */}
                        <div className="mt-1 shrink-0 flex items-center gap-2">
                          <span className="font-mono text-[0.5625rem] text-foreground/60 tabular-nums w-4">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="w-3 h-3 border border-accent/30 flex items-center justify-center group-hover/detail:border-accent transition-colors duration-300">
                            <CheckCircle2
                              size={8}
                              className="text-accent opacity-0 group-hover/detail:opacity-100 transition-opacity duration-300"
                            />
                          </div>
                        </div>
                        <span className="text-on-surface-variant group-hover/detail:text-foreground transition-colors duration-300 text-sm font-light leading-relaxed">
                          {detail}
                        </span>
                      </div>
                      {/* Horizontal rule between details */}
                      {i < item.details.length - 1 && (
                        <div className="h-[1px] bg-foreground/[0.03] ml-10" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Proof: the certificate and the work, one click away */}
                {(item.proof || item.cases) && (
                  <div className="relative z-10 px-6 md:px-12 pb-6 flex flex-wrap gap-3">
                    {item.proof && (
                      <a
                        href={item.proof.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/proof inline-flex items-center gap-2 px-3 py-2 border border-accent/30 bg-accent/5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-background transition-colors duration-300"
                      >
                        <Award
                          size={12}
                          className="transition-transform duration-300 group-hover/proof:rotate-12"
                          aria-hidden="true"
                        />{" "}
                        {item.proof.label}
                      </a>
                    )}
                    {item.cases && (
                      <CaseFilterLink
                        params={item.cases.params}
                        className="group/cases inline-flex items-center gap-2 px-3 py-2 border border-tertiary/30 bg-tertiary/5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-tertiary hover:bg-tertiary hover:text-background transition-colors duration-300"
                      >
                        <FolderSearch
                          size={12}
                          className="transition-transform duration-300 group-hover/cases:scale-110"
                          aria-hidden="true"
                        />{" "}
                        {item.cases.label}
                      </CaseFilterLink>
                    )}
                  </div>
                )}

                {/* Panel Footer */}
                <div className="px-6 md:px-12 py-4 border-t border-foreground/5 flex items-center justify-between">
                  <span className="font-mono text-[0.5625rem] text-foreground/65 tracking-[0.2em] uppercase">
                    {item.details.length}{" "}
                    {item.details.length === 1 ? "key result" : "key results"}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-primary/40" />
                    <div className="w-1 h-1 bg-accent/30" />
                    <div className="w-1 h-1 bg-foreground/10" />
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
