"use client";

/* The keyboard shortcuts sheet ("?"), loaded on first use */

import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { m as motion } from "framer-motion";
import { Keyboard } from "lucide-react";

/* keys joined by "+" are pressed together; by "then", one after the other */
const GROUPS: { title: string; note?: string; join: "+" | "then"; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "Basics",
    join: "+",
    items: [
      { keys: ["Ctrl", "K"], label: "Search the site (⌘ K on a Mac)" },
      { keys: ["/"], label: "Search the site — quicker" },
      { keys: ["?"], label: "Show this list" },
      { keys: ["Esc"], label: "Close any window" },
    ],
  },
  {
    title: "Jump to a section",
    note: "Press G, let go, then press the second key within a second.",
    join: "then",
    items: [
      { keys: ["G", "H"], label: "Home" },
      { keys: ["G", "W"], label: "Projects" },
      { keys: ["G", "E"], label: "Experience" },
      { keys: ["G", "L"], label: "Teaching" },
      { keys: ["G", "P"], label: "Training sites" },
      { keys: ["G", "C"], label: "All certificates" },
      { keys: ["G", "A"], label: "Attack map (MITRE ATT&CK)" },
      { keys: ["G", "B"], label: "All case studies" },
      { keys: ["G", "T"], label: "Back to the top" },
    ],
  },
  {
    title: "Just for fun",
    join: "then",
    items: [{ keys: ["Type", "3omda"], label: "Opens a hidden terminal" }],
  },
];

export default function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap([dialogRef], true);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[300] flex items-start justify-center bg-background/70 px-4 pt-[14vh] backdrop-blur-sm"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
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

        <p className="border-b border-foreground/5 px-5 py-3 text-sm text-foreground/60 font-light">
          Optional — everything also works with a mouse or a finger. These keys are only shortcuts.
        </p>

        <div className="grid gap-6 p-5">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="mb-1 font-mono text-[0.5625rem] uppercase tracking-[0.3em] text-foreground/60">
                {group.title}
              </h3>
              {group.note && <p className="mb-3 text-xs text-foreground/60">{group.note}</p>}
              <ul className="grid gap-1">
                {group.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-4 px-2 py-1.5">
                    <span className="flex min-w-[130px] shrink-0 items-center gap-1.5">
                      {item.keys.map((key, k) => (
                        <span key={key} className="flex items-center gap-1.5">
                          {k > 0 && <span className="font-mono text-[0.5625rem] text-foreground/50">{group.join}</span>}
                          <kbd className="border border-foreground/15 bg-foreground/[0.03] px-1.5 py-0.5 font-mono text-[0.625rem] text-accent">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </span>
                    <span className="text-sm text-foreground/70">{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
