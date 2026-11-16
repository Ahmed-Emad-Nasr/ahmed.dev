"use client";

/*
 * ═══ components/home/HeroSection.tsx — the TOP of the home page ═══
 *
 * Sensei-Dev's hero (github.com/MostafaSensei106/Sensei-Dev, GPL-3.0) as is,
 * with Ahmed's data. The entrance is GSAP, like the original; it only waits
 * for the intro screen to lift (lib/intro.ts) so it is actually seen.
 *
 * WHERE THE TEXT COMES FROM (edit there, not here):
 *   name, japaneseTitle, hero.specs, hero.tagline, hero.cvUrl,
 *   availability, title, focus, contact.*        → data/profile.ts
 *   the summary paragraph + "Evidence" row        → data/live-copy.ts
 *   the project count + the language codes        → app/page.tsx (props)
 *   the portrait → public/Assets/art-gallery/Images/logo/3omda-560.webp
 */

import { RevealText } from "@/components/ui/RevealText";
import { HeroMascot } from "@/components/home/HeroMascot";
import { PROFILE } from "@/data/profile";
import { normalizePublicHref } from "@/lib/shared";
import gsap from "gsap";
import { ArrowDown, Download, MessageCircle } from "lucide-react";
import { Github, Linkedin, Youtube } from "@/components/ui/BrandIcons";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/fx";
import { whenIntroDone } from "@/lib/intro";

function FieldRow({ label, value, hot = false }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-foreground/5 last:border-b-0">
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-foreground/60 shrink-0">
        {label}
      </dt>
      <dd className={`max-w-[72%] font-mono text-xs text-right leading-relaxed break-words ${hot ? "text-accent font-bold" : "text-foreground/80"}`}>
        {value}
      </dd>
    </div>
  );
}

/* Label colours of the spec strip, in order */
const SPEC_TONES = ["text-primary-ink", "text-accent", "text-tertiary", "text-foreground/60"];

export default function HeroSection({
  description,
  evidenceLabel,
  projectCount,
  languageCodes,
}: {
  description: string;
  evidenceLabel?: string;
  projectCount: number;
  languageCodes: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return; // final state is the natural layout
    let ctx: gsap.Context | undefined;
    const stopWaiting = whenIntroDone(() => {
      ctx = gsap.context(() => {
        gsap.from(".hero-content > *", {
          y: 12,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power2.out",
        });

        gsap.from(".hero-image", {
          opacity: 0,
          duration: 1.1,
          ease: "power2.out",
        });
      }, containerRef);
    });

    return () => {
      stopWaiting();
      ctx?.revert();
    };
  }, []);

  const socials = [
    {
      name: "GitHub",
      icon: Github,
      href: `https://github.com/${PROFILE.contact.github}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `${PROFILE.contact.linkedin}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/${PROFILE.contact.whatsapp}`,
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: PROFILE.contact.youtube,
    },
  ];

  const focusLabel = PROFILE.focus.join(" · ");
  const shippedLabel = `${projectCount} open-source projects`;

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center px-6 overflow-hidden pt-32 pb-24 bg-background"
    >
      {/* ─── Speed lines ─── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="speed-line absolute h-[1px] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent"
            style={{
              top: `${15 + i * 10}%`,
              left: 0,
              width: `${40 + i * 8}%`,
              transform: `rotate(${-2 + i * 0.5}deg)`,
            }}
          />
        ))}
      </div>

      {/* ─── Background Japanese watermark ─── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="japanese-bg absolute right-10 top-1/2 -translate-y-1/2 flex gap-12 text-foreground/[0.03] font-black text-[10vw] select-none pointer-events-none z-0 leading-none"
          role="img"
        >
          <div className="vertical-text">
            <span>ア</span>
            <span>ナ</span>
            <span>リ</span>
            <span>ス</span>
            <span>ト</span>
          </div>
          <div className="vertical-text">
            <span>村</span>
            <span>長</span>
          </div>
        </div>
      </div>

      {/* ─── Flow ─── */}
      <div className="hero-content relative z-10 w-full max-w-[90rem] mx-auto flex flex-col items-start">
        {/* Badge */}
        <div className="flex max-w-full items-center gap-3 px-4 py-2 bg-foreground/[0.03] border border-foreground/10 mb-8">
          <div className="w-2 h-2 shrink-0 bg-primary" />
          <span className="min-w-0 sm:whitespace-nowrap text-[0.5rem] font-mono font-bold uppercase tracking-[0.15em] text-on-surface-variant sm:text-xs sm:tracking-[0.16em]">
            {PROFILE.japaneseTitle}
          </span>
        </div>

        {/* ─── Masthead: name first, portrait second  one row ─── */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 w-full">
          {/* Name */}
          <div className="text-center md:text-left order-2 md:order-1 w-full md:w-auto md:flex-1 min-w-0">
            <p className="font-mono text-[0.6875rem] md:text-xs font-bold uppercase tracking-[0.16em] text-primary-ink mb-3">
              Portfolio · 履歴書
            </p>
            {/* The size follows the room left beside the portrait, so "EMAD NASR"
                (about 8.3 times the font size wide) always fits on ONE line:
                phones → screen width; md → screen minus portrait, gap and indent;
                lg → the same inside the 90rem column, capped at the old 8rem (9xl). */}
            <h1 className="font-display text-[min(3.75rem,calc((100vw-3rem)/8.3))] md:text-[calc((100vw-24.75rem)/8.3)] lg:text-[min(8rem,calc((min(100vw,93rem)-29.5rem)/8.3))] font-black leading-[0.85] tracking-tighter uppercase">
              <RevealText text="Ahmed" className="block text-foreground" />
              {/* The space keeps the text "Ahmed Emad Nasr" (not "AhmedEmad")
                  for search engines and screen readers; the lines are blocks */}{" "}
              {/* Side by side on one line, at every width */}
              <RevealText
                text="Emad Nasr"
                delay={0.12}
                className="block md:ml-10 text-transparent whitespace-pre"
                style={{ WebkitTextStroke: "2px var(--primary)" }}
              />
            </h1>
            <p
              className="brush-jp text-xl md:text-2xl text-foreground/40 mt-4"
              lang="ja"
              aria-hidden="true"
              data-jp="アハメド・エマド・ナスル  情報セキュリティ"
            />
          </div>

          {/* Portrait */}
          <div className="hero-image relative max-w-[78vw] w-[13.75rem] sm:w-[16.25rem] lg:w-[20rem] aspect-square shrink-0 order-1 md:order-2 md:ml-auto">
            {/* Hinomaru sun */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <div className="hinomaru-sun absolute inset-[-20%] flex items-center justify-center pointer-events-none">
                <div
                  className="w-[80%] h-[80%] rounded-full opacity-[0.07]"
                  style={{
                    background:
                      "radial-gradient(circle, var(--primary) 0%, var(--primary) 40%, transparent 70%)",
                  }}
                />
              </div>
            </div>

            {/* Orbit inscription  stack names circling the portrait */}
            <div
              className="absolute -inset-3 animate-[spin_36s_linear_infinite] pointer-events-none"
              aria-hidden="true"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <path
                    id="hero-orbit"
                    d="M 100,100 m -86,0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0"
                  />
                </defs>
                <text fontSize="8" letterSpacing="2.5" className="fill-foreground/30 font-mono uppercase">
                  <textPath href="#hero-orbit">
                    SOC • IR • GRC • ISO 27001 • SOAR • Splunk • YARA • IAM • PAM • 侍 •
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Camera Viewfinder Brackets */}
            <div className="absolute top-2 left-2 w-7 h-7 border-l-2 border-t-2 border-foreground/20 pointer-events-none" />
            <div className="absolute top-2 right-2 w-7 h-7 border-r-2 border-t-2 border-foreground/20 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-7 h-7 border-l-2 border-b-2 border-foreground/20 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-7 h-7 border-r-2 border-b-2 border-foreground/20 pointer-events-none" />

            {/* The Photo */}
            <a
              href={PROFILE.contact.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group/photo absolute inset-5 block rounded-full"
              aria-label="Watch the YouTube channel"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-foreground/10 group-hover/photo:border-primary/40 transition-colors duration-300">
                <Image
                  src={normalizePublicHref("Assets/art-gallery/Images/logo/3omda-560.webp")}
                  alt={PROFILE.name}
                  width={560}
                  height={560}
                  priority
                  sizes="(max-width: 639px) 176px, (max-width: 1023px) 216px, 276px"
                  className="w-full h-full object-cover object-top grayscale group-hover/photo:grayscale-0 group-hover/photo:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent group-hover/photo:from-transparent transition-all duration-700" />
              </div>
            </a>

            {/* Hanko seal  the maker's stamp */}
            <div
              className="absolute bottom-5 right-5 z-20 w-12 h-12 lg:w-14 lg:h-14 bg-primary rotate-6 hover:rotate-0 transition-transform duration-300 flex items-center justify-center"
              role="img"
              aria-label="Maker's seal"
            >
              <div className="absolute inset-1.5 border border-foreground/40 pointer-events-none" />
              <span
                className="brush-jp text-xl lg:text-2xl text-foreground leading-none"
                lang="ja"
                aria-hidden="true"
                data-jp="村長"
              />
            </div>

            {/* Outer decorative ring with dashes */}
            <div
              className="absolute inset-[-4px] rounded-full pointer-events-none"
              style={{
                border: "1px dashed rgba(255,255,255,0.06)",
              }}
            />

            {/* Mascot companion — a random blue-team mascot per visit
                (components/home/HeroMascot.tsx); click it for the next one */}
            <HeroMascot className="absolute -bottom-3 -left-4 z-20 lg:-left-8" />
          </div>
        </div>

        {/* ─── Content: proof + field record ─── */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.35fr_.65fr] gap-10 items-start w-full">
          <div className="min-w-0">
            {/* Tech Spec Sheet */}
            <div className="mb-8 w-full border border-foreground/5 bg-foreground/[0.02]">
              <div className="border-b border-foreground/5 px-4 py-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary" />
                <span className="font-mono text-[0.625rem] text-foreground/60 uppercase tracking-[0.16em]">
                  Technical Specifications
                </span>
              </div>
              <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {PROFILE.hero.specs.map((spec, i) => (
                  <div key={spec.label} className="spec-item flex flex-col gap-1.5">
                    <span className={`font-mono text-[0.625rem] font-bold tracking-[0.2em] uppercase ${SPEC_TONES[i % SPEC_TONES.length]}`}>
                      {spec.label}
                    </span>
                    <span className="font-mono text-sm text-foreground/85">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tagline & Description */}
            <div className="mb-8">
              <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-5">
                {PROFILE.hero.tagline}
              </p>
              <p className="text-lg text-on-surface-variant font-light leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTA Buttons + Socials */}
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-wrap gap-4">
                <a
                  href={PROFILE.hero.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="interactive btn-sheen group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-primary text-white font-mono font-black uppercase tracking-widest text-sm transition-colors duration-200 hover:bg-[var(--primary-hover)]"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
                  }}
                >
                  <Download size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5" />
                  Download CV
                  <span className="sr-only"> (download)</span>
                  <span
                    className="brush-jp text-base normal-case tracking-normal opacity-70"
                    lang="ja"
                    aria-hidden="true"
                    data-jp="履歴書"
                  />
                </a>
                <a
                  href="#work"
                  className="interactive group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 border border-foreground/15 border-l-2 border-l-primary bg-foreground/[0.02] text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-colors duration-200 hover:border-primary hover:bg-primary/10"
                >
                  <ArrowDown size={14} className="text-primary-ink transition-transform duration-300 group-hover:translate-y-0.5" />
                  View Work
                  <span
                    className="brush-jp text-base normal-case tracking-normal text-foreground/50"
                    lang="ja"
                    aria-hidden="true"
                    data-jp="仕事"
                  />
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-4 lg:mt-0 lg:ml-4">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social relative w-11 h-11 flex items-center justify-center border border-foreground/10 bg-foreground/[0.02] text-foreground/60 transition-colors duration-200 hover:border-primary hover:text-primary-ink"
                    aria-label={s.name}
                  >
                    <span
                      className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary/0 group-hover/social:border-primary transition-colors duration-300"
                      aria-hidden="true"
                    />
                    <s.icon size={18} strokeWidth={1.5} />
                    <span
                      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 bg-background border border-primary/40 font-mono text-[0.5625rem] font-bold tracking-[0.25em] uppercase text-primary-ink opacity-0 group-hover/social:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    >
                      {s.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Field record  live portfolio data, zero hardcodes */}
          <aside
            className="relative border border-foreground/10 bg-foreground/[0.02] p-6 md:p-7"
            aria-label="Field record"
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50 pointer-events-none" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="font-mono text-[0.625rem] font-bold tracking-[0.16em] uppercase text-primary-ink">
                Field Record
              </span>
              <span
                className="brush-jp text-base text-foreground/30"
                lang="ja"
                aria-hidden="true"
                data-jp="記録"
              />
            </div>
            <dl className="flex flex-col">
              <FieldRow label="Status" value={PROFILE.availability} hot />
              <FieldRow label="Role" value={PROFILE.title} />
              <FieldRow label="Base" value={PROFILE.contact.location} />
              <FieldRow label="Focus" value={focusLabel} />
              {evidenceLabel && <FieldRow label="Evidence" value={evidenceLabel} />}
              <FieldRow label="Shipped" value={shippedLabel} />
              <FieldRow label="Languages" value={languageCodes} />
            </dl>
          </aside>
        </div>
      </div>

      {/* ─── Bottom Japanese Quote ─── */}
      <div
        className="absolute bottom-10 left-10 hidden md:flex items-center gap-4"
        aria-hidden="true"
        role="img"
      >
        <div className="w-8 h-[1px] bg-primary/40" />
        <p className="text-[0.625rem] text-foreground/60 font-mono font-bold uppercase tracking-[0.16em]">
          継続は力なり · PERSEVERANCE IS POWER
        </p>
      </div>
    </section>
  );
}
