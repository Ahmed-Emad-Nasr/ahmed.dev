"use client";

/*
 * ═══ components/home/HeroSection.tsx — the TOP of the home page ═══
 *
 * Sensei-Dev's hero (github.com/MostafaSensei106/Sensei-Dev, GPL-3.0) as is,
 * with Ahmed's data. The entrance is GSAP, like the original; it only waits
 * for the intro screen to lift (lib/intro.ts) so it is actually seen.
 *
 * WHERE THE TEXT COMES FROM (edit there, not here):
 *   name, title, hero.specs, hero.tagline, hero.cvUrl,
 *   availability, title, focus, contact.*        → data/profile.ts
 *   the summary paragraph                         → data/live-copy.ts
 *   the project count + the language codes        → app/page.tsx (props)
 *   the portrait → public/Assets/art-gallery/Images/logo/3omda-560.webp
 */

import { RevealText } from "@/components/ui/RevealText";
import { HeroMascots } from "@/components/home/HeroMascot";
import { PROFILE } from "@/data/profile";
import { normalizePublicHref } from "@/lib/shared";
import { gsapEase, gsapEnd, gsapStart } from "@/lib/ease";
import { ArrowDown, BriefcaseBusiness, Download, MessageCircle } from "lucide-react";
import { Github, Linkedin, Youtube } from "@/components/ui/BrandIcons";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { calmEffects } from "@/lib/fx";
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
  projectCount,
  languageCodes,
}: {
  description: string;
  projectCount: number;
  languageCodes: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (calmEffects()) return; // final state is the natural layout (reduced motion or a weak device)
    /* The entrance, drawn by the browser (element.animate) with GSAP's
       power2.out curve (lib/ease.ts): each block of the hero rises 12px and
       fades in, 50 ms after the one before it, and ends with the same inline
       values gsap.from left (gsapStart / gsapEnd). */
    const running: Animation[] = [];
    const stopWaiting = whenIntroDone(() => {
      const root = containerRef.current;
      if (!root) return;
      const easing = gsapEase("power2.out");
      const play = (el: HTMLElement, frames: Keyframe[], delay: number, moved: boolean) => {
        const opacity = getComputedStyle(el).opacity;
        if (moved) gsapStart(el);
        const anim = el.animate(frames, { duration: 550, delay, easing, fill: "backwards" });
        anim.onfinish = () => gsapEnd(el, opacity, moved);
        running.push(anim);
      };
      /* The photo is one of these blocks: it rises and fades in its turn
         like the others, and keeps only its opacity afterwards (what GSAP's
         second, photo-only tween left on it) */
      root.querySelectorAll<HTMLElement>(".hero-content > *").forEach((el, i) => {
        play(el, [{ opacity: 0, transform: "translate(0px, 12px)" }, {}], i * 50, !el.classList.contains("hero-image"));
      });
    });

    return () => {
      stopWaiting();
      running.forEach((a) => a.cancel());
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
      name: "Wuzzuf",
      icon: BriefcaseBusiness,
      href: PROFILE.contact.wuzzuf,
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
      className="relative min-h-screen flex items-center px-6 overflow-hidden pt-28 pb-24 bg-background"
    >
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
        <div className="flex max-w-full items-center gap-3 px-4 py-2 bg-foreground/[0.03] border border-foreground/10 mb-8 self-center md:self-start">
          <div className="w-2 h-2 shrink-0 bg-primary" />
          <span className="min-w-0 sm:whitespace-nowrap text-[0.5rem] font-mono font-bold uppercase tracking-[0.15em] text-on-surface-variant sm:text-xs sm:tracking-[0.16em]">
            {PROFILE.title}
          </span>
        </div>

        {/* ─── Masthead: name first, portrait second  one row ─── */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 w-full">
          {/* Name */}
          <div className="text-center md:text-left order-2 md:order-1 w-full md:w-auto md:flex-1 min-w-0">
            <p className="font-mono text-[0.6875rem] md:text-xs font-bold uppercase tracking-[0.16em] text-primary-ink mb-3">
              Portfolio
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
              className="hero-orbit absolute -inset-3 motion-reduce:animate-none pointer-events-none"
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
                    SOC • IR • GRC • ISO 27001 • SOAR • Splunk • YARA • IAM • PAM • DFIR •
                  </textPath>
                </text>
              </svg>
            </div>

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

            {/* Outer decorative ring with dashes */}
            <div
              className="absolute inset-[-4px] rounded-full pointer-events-none"
              style={{
                border: "1px dashed rgba(255,255,255,0.06)",
              }}
            />

            {/* Two mascots beside the portrait, one on each side — a random one
                of three per side, click for the next
                (components/home/HeroMascot.tsx) */}
            <HeroMascots />
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
                </a>
                <a
                  href="#work"
                  className="interactive group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 border border-foreground/15 border-l-2 border-l-primary bg-foreground/[0.02] text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-colors duration-200 hover:border-primary hover:bg-primary/10"
                >
                  <ArrowDown size={14} className="text-primary-ink transition-transform duration-300 group-hover:translate-y-0.5" />
                  View Work
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
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[2px] bg-primary" />
              <span className="font-mono text-[0.625rem] font-bold tracking-[0.16em] uppercase text-primary-ink">
                Field Record
              </span>
            </div>
            <dl className="flex flex-col">
              <FieldRow label="Status" value={PROFILE.availability} hot />
              <FieldRow label="Role" value={PROFILE.title} />
              <FieldRow label="Base" value={PROFILE.contact.location} />
              <FieldRow label="Focus" value={focusLabel} />
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
