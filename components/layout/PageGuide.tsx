"use client";

/*
 * ═══ components/layout/PageGuide.tsx — the "what's on this page" note ═══
 *
 * A small note a moment after a page opens — after its loader has lifted —
 * saying what the page holds (data/page-guides.ts). On every page that has
 * an entry, on phones too. On a computer it also points at Ctrl+K.
 *
 * Shown once per kind of page per browser (localStorage "guide:<id>"), and
 * closes by itself after 10 s, with the × or with Escape. To see them again
 * while testing: DevTools → Application → Local Storage → delete "guide:…".
 * Loaded after the page is idle (PageGuideMount.tsx), so it never slows it.
 */

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Compass, X } from "lucide-react";
import { guideFor, type PageGuide as Guide } from "@/data/page-guides";
import { whenIntroDone } from "@/lib/intro";

/* How long after the loader lifts it appears, and how long it stays */
const SHOW_AFTER = 1800;
const STAY = 10000;

export default function PageGuide() {
  const pathname = usePathname();
  const guide: Guide | undefined = useMemo(() => guideFor(pathname), [pathname]);
  /* The page the note is open on — a new page closes it by itself */
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = guide !== undefined && openOn === pathname;
  const setOpen = (v: boolean) => setOpenOn(v ? pathname : null);
  /* Client-only component (ssr: false), so the device can be read at once */
  const [keyboard] = useState(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const [mac] = useState(() => /Mac|iPhone|iPad/.test(navigator.platform));

  /* A new page: wait for its loader, then show its note once */
  useEffect(() => {
    const g = guide;
    if (!g) return;
    try {
      /* "guide:all" switches every note off (the audit scripts set it) */
      if (localStorage.getItem(`guide:${g.id}`) || localStorage.getItem("guide:all")) return;
    } catch {
      return; // storage blocked: better never than every time
    }
    let timer = 0;
    const cancel = whenIntroDone(() => {
      timer = window.setTimeout(() => {
        setOpenOn(pathname);
        try {
          localStorage.setItem(`guide:${g.id}`, "1");
        } catch {
          /* ignore */
        }
      }, SHOW_AFTER);
    });
    return () => {
      cancel();
      window.clearTimeout(timer);
    };
  }, [guide, pathname]);

  /* Open: close by itself, or on Escape */
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpenOn(null), STAY);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!guide) return null;
  const ar = guide.ar === true;

  return (
    <div
      role="status"
      /* DhikrToast waits while this note is open */
      data-page-guide
      data-open={open}
      /* Out of the tab order and the accessibility tree while hidden */
      inert={!open}
      lang={ar ? "ar" : "en"}
      dir={ar ? "rtl" : "ltr"}
      className={`fixed bottom-4 inset-x-4 md:bottom-6 md:inset-x-auto ${ar ? "md:right-6" : "md:left-6"} z-[85] md:max-w-sm flex items-start gap-4 border border-foreground/10 bg-surface/95 px-5 py-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      } ${ar ? "lang-ar" : ""}`}
    >
      <span
        className="absolute top-0 start-0 h-[2px] w-full origin-left rtl:origin-right bg-primary guide-timer"
        data-on={open}
        aria-hidden="true"
      />
      <Compass size={16} className="mt-0.5 text-primary-ink shrink-0" aria-hidden="true" />
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-primary-ink">{guide.title}</p>
        <p className="mt-1.5 text-foreground/80">{guide.text}</p>
        {keyboard && !ar && (
          <p className="mt-2 text-foreground/60">
            <kbd className="px-1.5 py-0.5 border border-foreground/20 font-mono text-xs">{mac ? "⌘" : "Ctrl"} K</kbd> searches the
            whole site.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="-m-1 p-1 text-foreground/60 hover:text-foreground"
        aria-label={ar ? "إغلاق" : "Dismiss"}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
