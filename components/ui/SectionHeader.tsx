/*
 * ═══ components/ui/SectionHeader.tsx — the big two-line section title ═══
 * Sensei-Dev's SectionHeader (same props, same look):
 *   eyebrow   → the small red label above the title ("FAQ // Before you ask")
 *   japanese  → the faint Japanese word next to it
 *   titleA    → first line (white/black)      titleB → second line (red, italic)
 *   description / subLabel → the lines under the title
 *   size="lg" → the oversized title         aside → right-hand slot (a <CounterChip>)
 * Two additions of this site: `id` (for aria-labelledby on the section) and
 * `as="h1"` on pages where it is the page title. Large titles shrink to fit
 * narrow phones (title-fit in globals.css) instead of running off the screen.
 * Slides in from the left when it scrolls into view.
 */

import type { CSSProperties, ReactNode } from "react";
import FadeIn from "@/components/ui/FadeIn";

interface SectionHeaderProps {
  eyebrow?: string;
  japanese?: string;
  titleA: string;
  titleB: string;
  description?: ReactNode;
  /** Secondary log line under the title (mono + dot). */
  subLabel?: string;
  /** "lg" is the oversized hero-of-section treatment used by feature sections. */
  size?: "default" | "lg";
  /** Right-hand slot: counters, filters, badges. Implies a split layout. */
  aside?: ReactNode;
  align?: "left" | "split";
  className?: string;
  /** id of the heading (for aria-labelledby) */
  id?: string;
  /** Colour of the second line: "text-primary-ink" on lighter section
      backgrounds, where the plain red would fall below contrast */
  titleBClassName?: string;
  /** h1 on pages where this is the page title (case library, CV …) */
  as?: "h1" | "h2";
}

export default function SectionHeader({
  eyebrow,
  japanese,
  titleA,
  titleB,
  description,
  subLabel,
  size = "default",
  aside,
  align = "left",
  className = "",
  id,
  titleBClassName = "text-primary",
  as: Heading = "h2",
}: SectionHeaderProps) {
  const split = align === "split" || Boolean(aside);

  const titleSize =
    size === "lg"
      ? "title-fit leading-[0.9]"
      : "text-4xl md:text-6xl lg:text-7xl leading-[0.9]";
  /* title-fit needs the longest line's length */
  const fit = size === "lg" ? ({ "--title-n": Math.max(titleA.length, titleB.length, 5) } as CSSProperties) : undefined;

  return (
    <FadeIn
      x={-32}
      y={0}
      duration={0.7}
      className={[
        "relative mb-16 md:mb-20",
        split ? "flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? (
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-7 w-[60%] max-w-[26.25rem]">
          <div className="speed-lines absolute inset-0 opacity-70" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-primary/35" />
        </div>
      ) : null}

      <div className={split ? "min-w-0 flex-1" : undefined}>
        {eyebrow ? (
          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-primary" aria-hidden="true" />
            <span className="eyebrow text-primary-ink">{eyebrow}</span>
            {japanese ? (
              <span
                className="jp-eyebrow text-[0.6875rem] text-foreground/30 uppercase hidden sm:inline"
                lang="ja"
                aria-hidden="true"
                data-jp={japanese}
              />
            ) : null}
          </div>
        ) : null}

        <Heading id={id} className={`font-display font-black tracking-tighter uppercase ${titleSize}`} style={fit}>
          <span className="text-foreground">{titleA}</span> <br />
          <span className={`${titleBClassName} italic`}>{titleB}</span>
        </Heading>

        {subLabel ? (
          <div className="mt-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-primary" aria-hidden="true" />
            <span className="eyebrow-sm text-foreground/60">{subLabel}</span>
          </div>
        ) : null}

        {description ? (
          <p className="mt-5 text-base md:text-lg text-foreground/60 font-light leading-relaxed max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>

      {aside ? <div className="shrink-0">{aside}</div> : null}
    </FadeIn>
  );
}
