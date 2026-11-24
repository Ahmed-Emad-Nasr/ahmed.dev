"use client";

/*
 * ═══ components/home/BackToTop.tsx — the back-to-top button (home page) ═══
 *
 * A small button, bottom right, once you are two screens down. Instant,
 * like every jump on the site. Client only (ssr: false in
 * components/home/client-only.tsx): nothing to show before the page scrolls.
 */

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "@/lib/scroll";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    /* At most once per frame */
    const update = () => {
      frame = 0;
      setShow(window.scrollY > window.innerHeight * 2);
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
    <button
      type="button"
      onClick={() => scrollToTop()}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-4 right-4 z-[85] grid h-11 w-11 place-items-center border border-foreground/15 bg-background/80 text-foreground/80 transition-[opacity,transform,border-color,color] duration-300 hover:border-primary hover:text-primary-ink md:bottom-6 md:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={16} aria-hidden="true" />
    </button>
  );
}
