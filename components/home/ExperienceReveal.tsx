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
 * nothing until a card crosses the line. GSAP itself still draws the motion.
 * Kept in its own small client file so the section stays server-rendered.
 */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { calmEffects } from "@/lib/fx";

export default function ExperienceReveal({ className, children }: { className?: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    // Reduced motion or a weak device: leave every element in its natural, final position.
    if (!root || calmEffects()) return;

    const cards = gsap.utils.toArray<HTMLElement>(".exp-item", root);
    /* One paused tween per card, starting from off to the side and invisible */
    const tweens = new Map(
      cards.map((card, i) => [
        card,
        gsap.from(card, { x: i % 2 === 0 ? -100 : 100, opacity: 0, duration: 1.2, ease: "expo.out", paused: true }),
      ]),
    );

    /* "top bottom-=100": a card plays once its top is 100px above the bottom
       of the screen; it reverses only when it drops back below that line
       (scrolling up), never when it leaves through the top */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const tween = tweens.get(entry.target as HTMLElement);
          if (!tween) continue;
          if (entry.isIntersecting) tween.play();
          else if (entry.boundingClientRect.top > 0) tween.reverse();
        }
      },
      { rootMargin: "0px 0px -100px 0px" },
    );
    cards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      tweens.forEach((tween) => tween.revert());
    };
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
