/*
 * ═══ components/home/StudentFeedback.tsx — "From My Students." (#student-feedback) ═══
 * On the Teaching page (app/teaching/page.tsx). Every written note students
 * gave after the course, word for word and anonymous (data/testimonials.ts →
 * STUDENT_FEEDBACK). The first six show; "Show more" adds six at a time.
 * Server Component.
 */

import { Quote } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import CounterChip from "@/components/ui/CounterChip";
import ShowMore from "@/components/ui/ShowMore";
import { KanjiWatermark } from "@/components/ui/kit";
import { QuoteText } from "@/components/home/Testimonials";
import { STUDENT_FEEDBACK } from "@/data/testimonials";

export default function StudentFeedback() {
  return (
    <section
      id="student-feedback"
      aria-labelledby="student-feedback-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="受講生" side="right" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="student-feedback-title"
          eyebrow="Feedback // From my students"
          japanese="受講生の声"
          titleA="From My"
          titleB="Students."
          size="lg"
          description="What students wrote after the course — anonymous, and quoted exactly as they wrote it, typos included."
          aside={<CounterChip stats={[{ value: String(STUDENT_FEEDBACK.length).padStart(2, "0"), label: "Notes quoted" }]} />}
        />

        <ShowMore as="ul" first={6} label="Show more feedback" className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {STUDENT_FEEDBACK.map((t, i) => (
            <li key={i} className="break-inside-avoid mb-6">
              <FadeIn delay={(i % 3) * 0.06} y={20} duration={0.5}>
                <figure className="relative border border-foreground/10 bg-surface/40 p-6 hover:border-primary/40 transition-colors duration-300">
                  <Quote size={18} className="mb-3 text-primary/40" aria-hidden="true" />
                  <QuoteText t={t} />
                  <figcaption className="mt-5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-foreground/60">
                    {t.author} — {t.source}
                  </figcaption>
                </figure>
              </FadeIn>
            </li>
          ))}
        </ShowMore>
      </div>
    </section>
  );
}
