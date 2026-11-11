"use client";

/*
 * ═══ components/home/SectionRail.tsx — where am I on the (long) home page ═══
 *
 *   • The RAIL (wide screens, 1280px+): a thin column on the right edge with
 *     the page's chapters — 00 Intro, 01 Evidence, Contact, 02 Blog,
 *     03 Detection, 04 Lab, 05 Gallery. The chapter you are reading is lit;
 *     hover or focus shows its name; a click jumps there instantly (plain
 *     #anchors — lib/perf/PageEffects.tsx mounts lazy sections first).
 *   • BACK TO TOP (every screen size): a small button, bottom right, once
 *     you are two screens down. Instant, like every jump on the site.
 *
 * Edit the chapters → CHAPTERS below (id = a section id on the home page).
 * Client only (ssr: false in components/home/dynamic.tsx): nothing to show
 * before the page can scroll.
 */

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/scroll";

const CHAPTERS = [
  { id: "home", n: "00", label: "Intro" },
  { id: "work", n: "01", label: "Evidence" },
  { id: "contact", n: "@", label: "Contact" },
  { id: "blog", n: "02", label: "Blog" },
  { id: "attack", n: "03", label: "Detection" },
  { id: "lab", n: "04", label: "Lab" },
  { id: "gallery", n: "05", label: "Gallery" },
] as const;

export default function SectionRail() {
  const [active, setActive] = useState<string>("home");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    /* At most once per frame: which chapter starts above the 40% line */
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string = CHAPTERS[0].id;
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      setActive(current);
      setShowTop(window.scrollY > window.innerHeight * 2);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <nav
        aria-label="Page chapters"
        className="fixed right-5 top-1/2 z-[85] hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
      >
        {CHAPTERS.map((c) => {
          const on = c.id === active;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={on ? "location" : undefined}
              className="group flex items-center gap-2 py-0.5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.25em]"
            >
              <span
                className={`whitespace-nowrap bg-background/80 px-1.5 py-0.5 text-foreground/80 opacity-0 transition-opacity duration-180 group-hover:opacity-100 group-focus-visible:opacity-100`}
              >
                {c.label}
              </span>
              <span className={`tabular-nums transition-colors duration-180 ${on ? "text-primary-ink" : "text-foreground/40 group-hover:text-foreground/80"}`}>
                {c.n}
              </span>
              <span
                aria-hidden="true"
                className={`h-[2px] transition-[width,background-color] duration-300 ${on ? "w-6 bg-gradient-to-r from-primary to-tertiary" : "w-3 bg-foreground/25 group-hover:w-5 group-hover:bg-foreground/60"}`}
              />
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => scrollToTop()}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
        aria-hidden={!showTop}
        className={`fixed bottom-4 right-4 z-[85] grid h-11 w-11 place-items-center border border-foreground/15 bg-background/80 text-foreground/80 backdrop-blur-md transition-[opacity,transform,border-color,color] duration-300 hover:border-primary hover:text-primary-ink md:bottom-6 md:right-6 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp size={16} aria-hidden="true" />
      </button>
    </>
  );
}
