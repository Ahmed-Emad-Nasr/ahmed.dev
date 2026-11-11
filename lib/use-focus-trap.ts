"use client";

/*
 * useFocusTrap — keeps Tab / Shift+Tab inside an open dialog (the mobile
 * menu, the command palette, the terminal, the shortcuts sheet), using the
 * focus-trap library. `containers` may be several elements (the mobile menu
 * is the nav bar's close button plus the menu panel).
 *
 * The dialogs move focus in, close on Escape and hand focus back
 * themselves, so the trap only does the trapping.
 *
 * The library is not part of the first download: it is fetched in idle time
 * (the navbar is on every page, so this hook always mounts) and again on
 * demand the moment a dialog opens, whichever comes first.
 */

import { useEffect, type RefObject } from "react";
import { whenIdle } from "@/lib/perf/schedule";

const loadTrap = () => import("focus-trap");

export function useFocusTrap(containers: RefObject<HTMLElement | null>[], active: boolean): void {
  /* Warm the chunk so the first dialog traps focus straight away */
  useEffect(() => whenIdle(() => void loadTrap().catch(() => {})), []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let release: (() => void) | undefined;
    void loadTrap()
      .then(({ createFocusTrap }) => {
        if (cancelled) return;
        const els = containers.map((r) => r.current).filter((c): c is HTMLElement => !!c);
        if (!els.length) return;
        const trap = createFocusTrap(els, {
          initialFocus: false,
          fallbackFocus: els[0],
          escapeDeactivates: false,
          allowOutsideClick: true,
          returnFocusOnDeactivate: false,
          preventScroll: true,
        });
        try {
          trap.activate();
        } catch {
          /* nothing focusable yet: the dialog still works, just untrapped */
        }
        release = () => trap.deactivate();
      })
      .catch(() => {
        /* offline and never cached: the dialog still works, just untrapped */
      });
    return () => {
      cancelled = true;
      release?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [active]);
}
