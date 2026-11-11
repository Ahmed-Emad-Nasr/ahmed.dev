"use client";

/*
 * The keyboard layer on top of the command palette (which owns Ctrl/⌘+K):
 *
 *   /        open the palette
 *   ?        the shortcuts sheet
 *   g + h/r/w/e/l/p/c/a/b/t   jump to a section, the case library, or the top
 *   3omda    the hidden terminal
 *
 * Both overlays are lazy — none of their code loads until first use.
 *
 * ═══ components/layout/KeyboardShortcuts.tsx — site-wide KEYBOARD SHORTCUTS ═══
 *
 * HOW TO ADD A "g + key" JUMP:
 *   1. add  key: "section-id"  to GO_TO_SECTION below
 *      (the id must exist on the home page — the whole site is that page),
 *   2. add a line to GROUPS in components/layout/ShortcutsHelp.tsx so it
 *      shows up in the "?" help sheet.
 * Change the secret word → SECRET below.
 * Other components can open the overlays with
 *   window.dispatchEvent(new Event("sensei:open-terminal"))   or
 *   window.dispatchEvent(new Event("sensei:open-shortcuts")).
 * Shortcuts are ignored while typing in an input/textarea (isTypingTarget),
 * and ALL of them are single keys, so all of them stop when the visitor
 * turns single-key shortcuts off (lib/shortcut-prefs.ts, WCAG 2.1.4) —
 * the palette (Ctrl/⌘+K) and its "Keyboard shortcuts" command still work.
 */

import dynamic from "next/dynamic";
import { preloadable } from "@/lib/perf/lazy";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isTypingTarget, scrollToTop } from "@/lib/scroll";
import { scrollToHash } from "@/lib/perf/jump";
import { singleKeyShortcutsOn } from "@/lib/shortcut-prefs";

/* preloadable = fetched in idle time and then rendered without a suspended
   frame: React holds back a suspended→ready swap for ~300ms, which is what
   made the first open feel late. */
const ShortcutsHelp = preloadable(() => import("@/components/layout/ShortcutsHelp"));
const Terminal = dynamic(() => import("@/components/layout/Terminal"), { ssr: false });

type Overlay = "shortcuts" | "terminal" | null;

/* "g" then this key → jump to this section id on the home page */
const GO_TO_SECTION: Record<string, string> = {
  h: "home",
  w: "work",
  e: "experience",
  l: "teaching",
  p: "platforms",
  c: "all-certificates",
  a: "attack",
};

/* Typing these letters anywhere (not in a text box) opens the terminal */
const SECRET = "3omda";

export default function KeyboardShortcuts() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const router = useRouter();
  const pathname = usePathname() || "/";

  const pendingG = useRef(false);
  const gTimer = useRef<number | undefined>(undefined);
  const secretBuffer = useRef("");

  const close = useCallback(() => setOverlay(null), []);

  const goToSection = useCallback(
    (id: string) => {
      /* Every section is on the home page: jump to it, or open it from a case page */
      if (pathname !== "/") {
        router.push(`/#${id}`);
        return;
      }
      scrollToHash(id);
    },
    [pathname, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (!singleKeyShortcutsOn()) {
        pendingG.current = false;
        secretBuffer.current = "";
        return;
      }
      const key = e.key.toLowerCase();

      if (key.length === 1) {
        secretBuffer.current = (secretBuffer.current + key).slice(-SECRET.length);
        if (secretBuffer.current === SECRET) {
          secretBuffer.current = "";
          e.preventDefault();
          setOverlay("terminal");
          return;
        }
      }

      if (pendingG.current) {
        pendingG.current = false;
        window.clearTimeout(gTimer.current);

        if (key === "t") {
          e.preventDefault();
          scrollToTop();
          return;
        }
        if (key === "b") {
          e.preventDefault();
          goToSection("cases");
          return;
        }
        if (GO_TO_SECTION[key]) {
          e.preventDefault();
          goToSection(GO_TO_SECTION[key]);
          return;
        }
      }

      if (key === "g") {
        pendingG.current = true;
        window.clearTimeout(gTimer.current);
        gTimer.current = window.setTimeout(() => {
          pendingG.current = false;
        }, 1000);
        return;
      }

      if (key === "/") {
        e.preventDefault();
        window.dispatchEvent(new Event("sensei:palette"));
        return;
      }

      if (key === "?") {
        e.preventDefault();
        setOverlay((current) => (current === "shortcuts" ? null : "shortcuts"));
      }
    };

    const openTerminal = () => setOverlay("terminal");
    const openShortcuts = () => setOverlay("shortcuts");

    window.addEventListener("keydown", onKey);
    window.addEventListener("sensei:open-terminal", openTerminal);
    window.addEventListener("sensei:open-shortcuts", openShortcuts);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("sensei:open-terminal", openTerminal);
      window.removeEventListener("sensei:open-shortcuts", openShortcuts);
      window.clearTimeout(gTimer.current);
    };
  }, [goToSection, pathname, router]);

  return (
    <>
      {overlay === "shortcuts" && (
        <Suspense fallback={null}>
          <ShortcutsHelp onClose={close} />
        </Suspense>
      )}
      {overlay === "terminal" && <Terminal onClose={close} />}
    </>
  );
}
