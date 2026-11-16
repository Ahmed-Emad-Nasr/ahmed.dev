/*
 * ═══ components/home/ServicesSection.tsx — "What I Do." (#services) ═══
 *
 * Four pieces of work someone can hire me for: icon, title, what it is, what
 * it is done with, what they get at the end, a link to the proof on this site
 * and an "Ask about it" link that opens the visitor's mail app.
 * Layout and hover from Sensei-Dev's ServicesSection. Server Component.
 *
 * The text lives in data/services.ts. A fifth service needs an icon here
 * (ICONS, in the same order as SERVICES).
 */

import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, GraduationCap, Mail, Radar, SearchCheck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/Motion";
import { KanjiWatermark, chipTertiary } from "@/components/ui/kit";
import { SERVICES } from "@/data/services";
import { PROFILE } from "@/data/profile";

const ICONS = [ClipboardCheck, Radar, SearchCheck, GraduationCap];

const BODY = "Hi Ahmed,\n\nOrganisation:\nWhat we need:\nTimeline:\n";
const mailto = (subject: string) =>
  `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(BODY)}`;

const linkCls =
  "inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors duration-300";

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative py-24 md:py-32 px-6 md:px-20 bg-background overflow-hidden"
    >
      <KanjiWatermark chars="役務" side="left" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          id="services-title"
          eyebrow="Services // What I deliver"
          japanese="役務"
          titleA="What I"
          titleB="Do."
          description="Four pieces of work you can hire me for. Each one ends with something you keep — a report, a running system or a trained team — not slides. On site in Cairo or Benha, or online."
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const proofIsPage = s.proof.href.startsWith("/");
            return (
              <FadeIn as="li" key={s.id} y={32} duration={0.7} delay={idx * 0.08} className="flex">
                <TiltCard className="group spotlight spotlight-blue relative w-full bg-surface/60 border border-foreground/5 p-7 flex flex-col h-full hover:border-tertiary/50 transition-colors duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-2.5 bg-foreground/5 border border-foreground/10" aria-hidden="true">
                      <Icon size={18} className="text-tertiary" />
                    </div>
                    <span className="jp-eyebrow text-[0.6875rem] text-foreground/25" lang="ja" aria-hidden="true" data-jp={s.japanese} />
                  </div>
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed mb-5">{s.description}</p>
                  <ul className="flex flex-wrap gap-2 mb-5 mt-auto" aria-label="Done with">
                    {s.stack.map((t) => (
                      <li key={t} className={chipTertiary}>
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="pt-4 border-t border-foreground/5 font-mono text-[0.6875rem] text-accent tracking-[0.2em] uppercase">
                    <span className="sr-only">You get: </span>→ {s.deliverable}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                    {proofIsPage ? (
                      <Link prefetch={false} href={s.proof.href} className={`${linkCls} text-tertiary hover:text-foreground`}>
                        {s.proof.label} <ArrowUpRight size={12} aria-hidden="true" />
                      </Link>
                    ) : (
                      <a href={s.proof.href} className={`${linkCls} text-tertiary hover:text-foreground`}>
                        {s.proof.label} <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    )}
                    <a href={mailto(s.subject)} className={`${linkCls} text-foreground/60 hover:text-tertiary`}>
                      <Mail size={12} aria-hidden="true" /> Ask about it
                      <span className="sr-only"> — {s.title}</span>
                    </a>
                  </div>
                </TiltCard>
              </FadeIn>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
