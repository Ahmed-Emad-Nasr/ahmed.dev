/*
 * ═══ components/ui/QuoteText.tsx — a quote, word for word ═══
 * A recommendation or a student's note (data/testimonials.ts): each "\n" in
 * the data is a new paragraph, as the writer broke it; Arabic quotes are set
 * right-to-left. Used on /journey (#testimonials and each
 * /journey/<writer> page) and on /teaching (#student-feedback).
 */

import type { Testimonial } from "@/data/testimonials";

export default function QuoteText({ t, large = false }: { t: Testimonial; large?: boolean }) {
  const rtl = t.lang === "ar";
  return (
    <blockquote
      lang={t.lang ?? "en"}
      dir={rtl ? "rtl" : "ltr"}
      className={`${large ? "text-base md:text-lg" : "text-sm md:text-[0.9375rem]"} text-foreground/80 font-light leading-relaxed ${rtl ? "text-right" : ""}`}
    >
      {/* "\n" in the data = a new paragraph, as the writer broke it */}
      {t.quote.split("\n").map((line, i) => (
        <p key={i} className={i ? "mt-3" : undefined}>
          {line}
        </p>
      ))}
    </blockquote>
  );
}
