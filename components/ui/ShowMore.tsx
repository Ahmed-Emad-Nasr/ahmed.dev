"use client";

/*
 * ═══ components/ui/ShowMore.tsx — the site's one "Show more" list ═══
 *
 * Shows the first `first` items and a "Show more" button (the same button as
 * the case library and the videos) that adds `step` more per click. Hidden
 * items are not drawn at all — no layout, no paint, no images — until asked
 * for.
 *
 * Usage (the wrapper's classes go in className — a grid, a list, columns):
 *   <ShowMore first={3} label="Show more roles" className="grid gap-6">
 *     {items.map((x) => <Card key={x.id} … />)}
 *   </ShowMore>
 *
 *   first  → how many show at the start        step → how many each click adds
 *   as     → "ul" when the items are <li>s      label → the button text
 *   buttonClassName → the spacing around the button (default: mt-14 below the list)
 *
 * Keyboard and screen-reader users land on the first newly shown item after
 * a click, so they continue reading where the new items begin.
 */

import { Children, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function ShowMore({
  children,
  first,
  step = first,
  label = "Show more",
  as: Tag = "div",
  className,
  buttonClassName = "mt-14",
}: {
  children: ReactNode;
  first: number;
  step?: number;
  label?: string;
  as?: "div" | "ul";
  className?: string;
  buttonClassName?: string;
}) {
  const items = Children.toArray(children);
  const [visible, setVisible] = useState(first);
  const listRef = useRef<HTMLDivElement & HTMLUListElement>(null);
  const shown = Math.min(visible, items.length);

  const more = () => {
    const from = shown;
    setVisible((n) => Math.min(items.length, n + step));
    /* After React has drawn them: focus the first new item, without scrolling */
    requestAnimationFrame(() => {
      const el = listRef.current?.children[from] as HTMLElement | undefined;
      if (!el) return;
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <Tag ref={listRef} className={className}>
        {items.slice(0, shown)}
      </Tag>
      {shown < items.length && (
        <div className={`${buttonClassName} flex justify-center`}>
          <button
            type="button"
            onClick={more}
            className="group flex items-center gap-3 px-8 py-4 border border-foreground/15 border-l-2 border-l-primary bg-foreground/[0.02] text-foreground font-mono font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:-translate-y-[1.7px]"
          >
            <ChevronDown size={14} aria-hidden="true" className="text-primary-ink transition-transform duration-300 group-hover:translate-y-[1.7px]" />
            {label}
            <span className="font-mono text-[0.625rem] text-foreground/60 tabular-nums">
              {shown}/{items.length}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
