/*
 * PlatformsSection — "Proving Grounds": public training profiles a recruiter
 * can check. Numbers are fetched at build time (TryHackMe) or documented
 * results — nothing estimated. Server Component.
 *
 * ═══ components/home/PlatformsSection.tsx — the PLATFORMS section (#platforms) ═══
 *
 * One big "featured" card (TryHackMe, with live rank / rooms / badges) and a
 * grid of smaller cards for the other platforms (Hack The Box,
 * CyberDefenders, CyberTalents…).
 *
 * HOW TO EDIT
 *   • Add / change a platform card → STATIC_PLATFORMS in data/platforms.ts
 *     (id, name, mark like "HTB", japanese, handle, url, focus, stats).
 *   • TryHackMe numbers → fetched at build time by lib/api/tryhackme.ts;
 *     the fallback values (used offline) are THM_SNAPSHOT in data/platforms.ts,
 *     and the card's text is tryHackMePlatform() in the same file.
 *   • The heading text → the <h2 id="platforms-title"> below.
 *
 * Small building blocks in this file:
 *   Mark         → the square badge with the platform's initials
 *   ProfileLink  → the yellow "→ View profile" line at the bottom of a card
 *   FeaturedCard → the big TryHackMe card
 *   PlatformCard → one small card
 */

import { ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import OrgLogo from "@/components/ui/OrgLogo";
import { CounterBadge, KanjiWatermark, cardSurface } from "@/components/ui/kit";
import type { Platform, TryHackMeStats } from "@/data/platforms";

/* The platform's logo; its short monogram (platform.mark) when it has none */
function Mark({ platform }: { platform: Platform }) {
  return <OrgLogo name={platform.name} fallback={platform.mark} />;
}

function ProfileLink({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-accent">
      <span aria-hidden="true">→</span> {label}
      <ArrowUpRight size={12} className="transition-transform duration-180 group-hover:-translate-y-[1.7px] group-hover:translate-x-[1.7px]" aria-hidden="true" />
    </span>
  );
}

function FeaturedCard({ platform, stats }: { platform: Platform; stats: TryHackMeStats }) {
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardSurface} flex flex-col xl:flex-row gap-8 xl:gap-12 p-7 md:p-9`}
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/40 to-transparent" aria-hidden="true" />

      <div className="flex flex-col xl:w-[36%] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <Mark platform={platform} />
          <span className="jp-eyebrow text-[0.625rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp={platform.japanese} />
        </div>
        <h3 className="mt-6 font-display text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
          {platform.name}
        </h3>
        <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.15em] text-foreground/60">@{platform.handle}</p>
        <p className="mt-5 text-sm md:text-base text-foreground/60 font-light leading-relaxed">{platform.focus}</p>
        <div className="mt-auto pt-6">
          <ProfileLink label="View profile" />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 justify-center">
        {/* gap-px over a tinted backing draws the hairlines between cells */}
        <dl className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-foreground/10 border border-foreground/10">
          {platform.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 px-4 py-6 bg-surface last:col-span-2 sm:last:col-span-1">
              <dt className="order-2 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">{s.label}</dt>
              <dd className="order-1 font-mono text-xl font-black tabular-nums text-accent leading-none whitespace-nowrap">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">
          {stats.live ? "Live from TryHackMe at build" : "Last recorded"} · {stats.asOf}
        </p>
      </div>
    </a>
  );
}

function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cardSurface} flex h-full flex-col p-6 xl:p-7`}
    >
      <div className="flex items-start justify-between gap-4">
        <Mark platform={platform} />
        <span className="jp-eyebrow text-[0.625rem] text-foreground/30" lang="ja" aria-hidden="true" data-jp={platform.japanese} />
      </div>
      <h3 className="mt-6 font-display text-xl sm:text-2xl lg:text-lg xl:text-2xl font-black uppercase tracking-tight leading-none group-hover:text-primary transition-colors duration-180">
        {platform.name}
      </h3>
      <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.15em] text-foreground/60">@{platform.handle}</p>
      <p className="mt-4 text-sm text-foreground/60 font-light leading-relaxed">{platform.focus}</p>

      {platform.stats.length > 0 && (
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {platform.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <dt className="order-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-foreground/60">{s.label}</dt>
              <dd className="order-1 font-mono text-xl font-black tabular-nums text-accent leading-none">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-auto pt-6">
        <div className="pt-5 border-t border-foreground/10">
          <ProfileLink label="View profile" />
        </div>
      </div>
    </a>
  );
}

export default function PlatformsSection({
  featured,
  thm,
  others,
}: {
  featured: Platform;
  thm: TryHackMeStats;
  others: Platform[];
}) {
  return (
    <section
      id="platforms"
      aria-labelledby="platforms-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="修練" side="right" />

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn
          x={-32}
          y={0}
          duration={0.7}
          className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className="min-w-0 flex-1">
            <h2
              id="platforms-title"
              className="font-display title-fit [--title-n:8] font-black tracking-tighter uppercase leading-[0.85]"
            >
              <span className="text-foreground">Proving</span> <br />
              <span className="text-primary italic">Grounds.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              The training platforms where I practise: each one sets hands-on security challenges and scores them. Every profile is public — open it and check the numbers yourself.
            </p>
          </div>
          <CounterBadge value={`Top ${thm.topPercentage}%`} top="TryHackMe" bottom="Worldwide" tone="accent" />
        </FadeIn>

        <FadeIn className="mb-6">
          <FeaturedCard platform={featured} stats={thm} />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {others.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.08} className="h-full">
              <PlatformCard platform={p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
