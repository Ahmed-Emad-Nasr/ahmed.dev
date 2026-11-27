"use client";

/*
 * ═══ components/layout/DhikrToast.tsx — a small remembrance, now and then ═══
 *
 * A little card at the bottom of the page with an istighfar, a tasbih or an
 * ayah (data/adhkar.ts). It is meant to be gentle, so:
 *   • FIRST_AFTER → the first one comes a minute after the loader lifts
 *   • EVERY       → then one every four minutes, as long as the tab is open
 *   • STAY        → each stays 10 s, closes by itself, with the × or Escape;
 *                   the pointer over it pauses the countdown
 *   • it waits (RETRY) while the tab is hidden, the loader or the "what's on
 *     this page" note is on screen, or a photo is open in the lightbox
 *   • "لا تُظهر التذكيرات" switches it off for good in this browser
 *     (localStorage "dhikr:off"; delete it to bring it back). "guide:all"
 *     — the key the audit scripts set to silence every note — silences it too.
 *   • not printed (globals.css), no motion with "reduce motion"
 *
 * Loaded after the page is idle (PageGuideMount.tsx), so it never slows it.
 * TO CHANGE THE RHYTHM: the four numbers below.
 */

import { useEffect, useRef, useState } from "react";
import { BellOff, Moon, X } from "lucide-react";
import { ADHKAR } from "@/data/adhkar";
import { whenIntroDone } from "@/lib/intro";

const FIRST_AFTER = 60_000;
const EVERY = 240_000;
const STAY = 10_000;
const RETRY = 20_000;

const OFF_KEY = "dhikr:off";
const LAST_KEY = "dhikr:last";

/* Switched off by the visitor (or by the audit scripts); storage blocked
   counts as off — better never than every time */
function switchedOff(): boolean {
  try {
    return Boolean(localStorage.getItem(OFF_KEY) || localStorage.getItem("guide:all"));
  } catch {
    return true;
  }
}

/* Something else has the screen right now */
function busy(): boolean {
  return (
    document.hidden ||
    Boolean(document.querySelector('[data-app-loader], [data-page-guide][data-open="true"], .yarl__root'))
  );
}

export default function DhikrToast() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  /* Counts the cards shown; each close starts the wait for the next one */
  const [round, setRound] = useState(0);
  const last = useRef(-1);

  /* Waiting: after the intro, then until nothing else is on screen */
  useEffect(() => {
    if (switchedOff()) return;
    let timer = 0;
    let cancelIntro = () => {};
    const attempt = () => {
      if (switchedOff()) return;
      if (busy()) {
        timer = window.setTimeout(attempt, RETRY);
        return;
      }
      /* Round the list, from a random start */
      last.current = last.current < 0 ? Math.floor(Math.random() * ADHKAR.length) : (last.current + 1) % ADHKAR.length;
      setIndex(last.current);
      setOpen(true);
      try {
        sessionStorage.setItem(LAST_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    };
    let wait = EVERY;
    if (round === 0) {
      /* A reload does not start the minute over: count from the last card */
      let since = Infinity;
      try {
        since = Date.now() - Number(sessionStorage.getItem(LAST_KEY) ?? 0);
      } catch {
        /* ignore */
      }
      wait = since < EVERY ? Math.max(RETRY, EVERY - since) : FIRST_AFTER;
    }
    cancelIntro = whenIntroDone(() => {
      timer = window.setTimeout(attempt, wait);
    });
    return () => {
      cancelIntro();
      window.clearTimeout(timer);
    };
  }, [round]);

  /* Open: close by itself (paused while the pointer is on it), or on Escape */
  useEffect(() => {
    if (!open) return;
    const close = () => {
      setOpen(false);
      setRound((r) => r + 1);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const timer = hover ? 0 : window.setTimeout(close, STAY);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, hover]);

  const close = () => {
    setOpen(false);
    setHover(false);
    setRound((r) => r + 1);
  };
  const stopForGood = () => {
    try {
      localStorage.setItem(OFF_KEY, "1");
    } catch {
      /* ignore */
    }
    close();
  };

  const dhikr = ADHKAR[index] ?? ADHKAR[0];

  return (
    /* Centred on a computer (the "what's on this page" note is on the left
       and the back-to-top button on the right); above the button on a phone */
    <div
      data-dhikr
      className="pointer-events-none fixed inset-x-0 bottom-[4.5rem] z-[84] flex justify-center px-4 md:bottom-6"
    >
      <div
        role="status"
        /* Out of the tab order and the accessibility tree while hidden */
        inert={!open}
        lang="ar"
        dir="rtl"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative w-full max-w-sm overflow-hidden rounded-2xl border border-primary/25 bg-surface/95 px-4 pb-3 pt-4 text-center shadow-lg shadow-primary/10 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <span
          className="guide-timer absolute inset-x-0 top-0 h-[3px] origin-left rtl:origin-right bg-primary/70"
          data-on={open && !hover}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2">
            <span className="dhikr-float grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary-ink">
              <Moon size={16} aria-hidden="true" />
            </span>
            <span className="text-xs font-bold text-primary-ink">{dhikr.label}</span>
          </span>
          <button
            type="button"
            onClick={close}
            className="-m-1 p-1 text-foreground/60 hover:text-foreground"
            aria-label="إغلاق"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
        <p className="font-ayah mt-3 text-xl leading-[2] text-foreground">{dhikr.text}</p>
        <p className="mt-0.5 text-xs text-foreground/70">{dhikr.source}</p>
        <button
          type="button"
          onClick={stopForGood}
          className="mt-3 inline-flex min-h-6 items-center gap-1.5 text-xs text-foreground/70 transition-colors hover:text-primary-ink"
        >
          <BellOff size={12} aria-hidden="true" />
          لا تُظهر التذكيرات
        </button>
      </div>
    </div>
  );
}
