"use client";

/*
 * ═══ components/home/ExperienceReveal.tsx — the experience cards' entrance ═══
 * Sensei-Dev's GSAP ScrollTrigger code, as is: every `.exp-item` inside
 * slides in from alternating sides as it scrolls into view. Kept in its own
 * small client file so the experience section itself stays server-rendered.
 */

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceReveal({ className, children }: { className?: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reduced motion: leave every element in its natural, final position.
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".exp-item");

      cards.forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}
