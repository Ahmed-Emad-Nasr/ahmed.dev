"use client";

/*
 * ═══ components/home/LabSvg.tsx — the Home Lab <svg>, with its packets paused off screen ═══
 * The lab's travelling packets are SVG <animateMotion> (SMIL). Those are not
 * part of document.getAnimations(), so lib/perf/OffscreenAnimations.tsx cannot
 * pause them like the CSS loops. This wrapper pauses / resumes the SVG's own
 * timeline through pauseAnimations() / unpauseAnimations() while the diagram
 * is far off screen. Nothing looks different: the packets just wait where they
 * are and carry on when the diagram comes back near the screen.
 * HomeLab.tsx stays a server component and passes its drawing as children.
 */

import { useEffect, useRef, type ReactNode } from "react";

export default function LabSvg({ children, ...rest }: { children: ReactNode; viewBox: string; className?: string; role?: string; "aria-labelledby"?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || typeof IntersectionObserver === "undefined" || typeof svg.pauseAnimations !== "function") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) svg.unpauseAnimations();
        else svg.pauseAnimations();
      },
      { rootMargin: "200px 0px 200px 0px" },
    );
    io.observe(svg);
    return () => {
      io.disconnect();
      svg.unpauseAnimations();
    };
  }, []);

  return (
    <svg ref={ref} {...rest}>
      {children}
    </svg>
  );
}
