"use client";

/* The keyboard shortcuts sheet ("?"), loaded on first use

   ═══ components/layout/ShortcutsHelp.tsx ═══
   This is only the help text — the shortcuts themselves are handled in
   components/layout/KeyboardShortcuts.tsx. When you add a shortcut there,
   add a line to GROUPS here: keys = the key caps shown, label = what it does. */

import { useEffect, useRef, useState } from "react";
import { setSingleKeyShortcuts, singleKeyShortcutsOn } from "@/lib/shortcut-prefs";
import { lockScroll } from "@/lib/scroll";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { m as motion } from "framer-motion";
import { Keyboard } from "lucide-react";

const GROUPS: { title: string; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "General",
    items: [
      { keys: ["Ctrl", "K"], label: "Search the whole site" },
      { keys: ["/"], label: "Search the whole site (one key)" },
      { keys: ["?"], label: "Show this list" },
      { keys: ["Esc"], label: "Close any open window" },
    ],
  },
  {
    title: "Go to",
    items: [
      { keys: ["g", "h"], label: "Home" },
      { keys: ["g", "w"], label: "Projects" },
      { keys: ["g", "e"], label: "Experience" },
      { keys: ["g", "l"], label: "Teaching" },
      { keys: ["g", "p"], label: "Training platforms" },
      { keys: ["g", "c"], label: "All certificates" },
      { keys: ["g", "a"], label: "Attack techniques covered" },
      { keys: ["g", "b"], label: "Case library" },
      { keys: ["g", "t"], label: "Back to top" },
    ],
  },
  {
    title: "Hidden",
    items: [{ keys: ["type", "3omda"], label: "…try it" }],
  },
];

export default function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [singleKeys, setSingleKeys] = useState(singleKeyShortcutsOn);
  useFocusTrap([dialogRef], true);

  useEffect(() => {
    closeRef.current?.focus();
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-[300] flex items-start justify-center bg-background/85 px-4 pt-[14vh]"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.983 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.132 }}
        className="w-full max-w-xl max-h-[72vh] overflow-y-auto border border-foreground/10 bg-surface"
      >
        <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-4">
          <Keyboard size={16} className="shrink-0 text-primary-ink" />
          <h2 className="flex-1 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.35em] text-foreground">
            Keyboard shortcuts
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 border border-foreground/15 px-1.5 py-0.5 font-mono text-[0.625rem] text-foreground/60 transition-colors hover:border-primary hover:text-primary-ink"
          >
            ESC
          </button>
        </div>

        <div className="grid gap-6 p-5">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="mb-3 font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-foreground/60">
                {group.title}
              </h3>
              <ul className="grid gap-1">
                {group.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-4 px-2 py-1.5">
                    <span className="flex min-w-[110px] shrink-0 gap-1.5">
                      {item.keys.map((key) => (
                        <kbd
                          key={key}
                          className="border border-foreground/15 bg-foreground/[0.03] px-1.5 py-0.5 font-mono text-[0.625rem] text-accent"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                    <span className="text-sm text-foreground/70">{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* WCAG 2.1.4: every shortcut above but Ctrl+K and Esc is one key */}
          <div className="flex flex-wrap items-center gap-3 border-t border-foreground/10 pt-4">
            <p className="flex-1 text-xs text-foreground/60">
              Single-key shortcuts are <strong className="text-foreground/80">{singleKeys ? "on" : "off"}</strong>.
              {" "}Ctrl+K and Esc always work.
            </p>
            <button
              type="button"
              onClick={() => {
                setSingleKeyShortcuts(!singleKeys);
                setSingleKeys(!singleKeys);
              }}
              className="border border-foreground/15 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:border-primary hover:text-primary-ink"
            >
              {singleKeys ? "Turn off" : "Turn on"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
