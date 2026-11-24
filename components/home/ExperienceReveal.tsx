"use client";

/*
 * ═══ components/home/ExperienceReveal.tsx — the experience cards' entrance ═══
 * Every `.exp-item` inside slides in from alternating sides as it scrolls
 * into view, and slides back out when you scroll back above it — the same
 * movement as Sensei-Dev's GSAP ScrollTrigger version.
 *
 * It watches the cards with the browser's IntersectionObserver instead of
 * ScrollTrigger: ScrollTrigger keeps a loop running 60 times a second for as
 * long as the page is open, even when nothing moves; the observer costs
 * nothing until a card crosses the line. The motion is drawn by the browser
 * itself (element.animate, off the main thread) with GSAP's expo.out curve
 * (lib/ease.ts) — the same movement, without 26 KB of GSAP.
 * Kept in its own small client file so the section stays server-rendered.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { gsapEase, gsapEnd, gsapStart } from "@/lib/ease";
import { calmEffects } from "@/lib/fx";

export default function ExperienceReveal({ className, children }: { className?: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    // Reduced motion or a weak device: leave every element in its natural, final position.
    if (!root || calmEffects()) return;

    const cards = [...root.querySelectorAll<HTMLElement>(".exp-item")];
    const easing = gsapEase("expo.out");
    const DURATION = 1200;
    /* One paused animation per card, held at its start: off to the side and
       invisible (fill "both" keeps that start state until it plays) */
    const tweens = new Map(
      cards.map((card, i) => {
        const opacity = getComputedStyle(card).opacity;
        gsapStart(card);
        const anim = card.animate(
          [{ opacity: 0, transform: `translate(${i % 2 === 0 ? -100 : 100}px, 0px)` }, {}],
          { duration: DURATION, easing, fill: "both" },
        );
        anim.pause();
        /* Played to the end: the final values stay inline, as GSAP leaves them */
        anim.onfinish = () => {
          if (anim.playbackRate > 0) gsapEnd(card, opacity);
        };
        return [card, anim] as const;
      }),
    );
    /* Forward (play) or backward (reverse) from wherever it is now — and
       nothing when it is already at that end, as GSAP's play()/reverse() */
    const run = (anim: Animation, forward: boolean) => {
      const t = Number(anim.currentTime ?? 0);
      if (forward ? t >= DURATION : t <= 0) return;
      if (anim.playState === "running" && (anim.playbackRate > 0) === forward) return;
      anim.playbackRate = forward ? 1 : -1;
      anim.play();
    };

    /* "top bottom-=100": a card plays once its top is 100px above the bottom
       of the screen; it reverses only when it drops back below that line
       (scrolling up), never when it leaves through the top */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const tween = tweens.get(entry.target as HTMLElement);
          if (!tween) continue;
          if (entry.isIntersecting) run(tween, true);
          else if (entry.boundingClientRect.top > 0) run(tween, false);
        }
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      tweens.forEach((tween) => tween.cancel());
    };
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
