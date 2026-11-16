"use client";

/*
 * ═══ components/home/FaqSection.tsx — "Fair Questions." (#faq) ═══
 * An accordion, one answer open at a time (data/about.ts → FAQ). The answer
 * slides open; the + turns into ×. Layout from Sensei-Dev's FaqSection.
 */

import { useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { Plus } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import { KanjiWatermark } from "@/components/ui/kit";
import { MOTION_EASE } from "@/lib/motion";
import { FAQ } from "@/data/about";

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden">
      <KanjiWatermark chars="質問" side="left" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="faq-title"
          eyebrow="FAQ // Before you ask"
          japanese="質問"
          titleA="Fair"
          titleB="Questions."
          size="lg"
          description="The answers recruiters usually need before the first call."
          aside={<CounterChip stats={[{ value: String(FAQ.length).padStart(2, "0"), label: "Answers ready" }]} />}
        />

        <div className="max-w-4xl flex flex-col border-t border-foreground/10">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={f.q} className="border-b border-foreground/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-q-${i}`}
                    className="flex w-full items-center gap-4 py-5 text-left group"
                  >
                    <span className="font-mono text-[0.6875rem] text-foreground/60 tabular-nums w-6 shrink-0" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 font-display text-lg md:text-xl font-black uppercase tracking-tight transition-colors ${
                        isOpen ? "text-primary-ink" : "text-foreground group-hover:text-primary-ink"
                      }`}
                    >
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`shrink-0 border p-1.5 transition-colors ${isOpen ? "border-primary text-primary-ink" : "border-foreground/15 text-foreground/60"}`}
                      aria-hidden="true"
                    >
                      <Plus size={15} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: MOTION_EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pl-10 pr-4 text-sm md:text-base text-foreground/60 font-light leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
