"use client";

/*
 * ═══ components/layout/ContactFooter.tsx — the CONTACT section ═══
 *
 * The CONTACT section of the home page (#contact): big heading, e-mail with
 * copy button, social icons and the contact form. The blog and the gallery
 * follow it; the page's last line is FooterBar (app/page.tsx).
 *
 * HOW THE FORM SENDS (no server — GitHub Pages is static, and no
 * third-party form service): it opens the visitor's own mail app with the
 * message filled in, and offers Gmail / "copy message" when none opens.
 *
 * HOW TO EDIT
 *   • E-mail, GitHub, LinkedIn, WhatsApp, YouTube… → PROFILE.contact
 *     in data/profile.ts.
 *   • Add / remove a social icon → the socialLinks array in ContactFooter.
 *   • Footer links → components/layout/FooterBar.tsx.
 */

import { useEffect, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowUpRight, Mail, Copy, Check } from "lucide-react";
import { Github, Linkedin, Youtube, Instagram, XLogo } from "@/components/ui/BrandIcons";
import { PORTFOLIO_DATA } from "@/data/portfolio-data";
import { PROFILE } from "@/data/profile";
import { useCopyLink } from "@/lib/use-copy-link";
import FadeIn from "@/components/ui/FadeIn";
import { MOTION_EASE } from "@/lib/motion";

type Draft = { subject: string; body: string };

const EMAIL = PROFILE.contact.email;

/* Gmail's web composer, prefilled — for visitors with no mail app set up,
   where a mailto: link silently does nothing. */
const gmailComposeUrl = ({ subject, body }: Draft) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export default function ContactFooter() {
  const { state: emailCopy, copy: copyEmail } = useCopyLink();
  const { state: draftCopy, copy: copyDraft } = useCopyLink();
  /* The last message handed to the mail app — kept so the fallback panel
     can offer the same text another way. */
  const [draft, setDraft] = useState<Draft | null>(null);
  /* The "READY TO SEND" stamp: bumped on every send, shown for ~2 s */
  const [stamp, setStamp] = useState(0);
  useEffect(() => {
    if (!stamp) return;
    const t = window.setTimeout(() => setStamp(0), 2200);
    return () => window.clearTimeout(t);
  }, [stamp]);

  /* The social icon buttons — add one by copying an entry */
  const socialLinks = [
    { name: "GitHub", icon: Github, href: `https://github.com/${PROFILE.contact.github}`, color: "text-primary-ink" },
    { name: "LinkedIn", icon: Linkedin, href: `${PROFILE.contact.linkedin}`, color: "text-[#0077b5]" },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/${PROFILE.contact.whatsapp}`, color: "text-[#25d366]" },
    { name: "YouTube", icon: Youtube, href: PROFILE.contact.youtube, color: "text-[#ff0000]" },
    { name: "Instagram", icon: Instagram, href: PROFILE.contact.instagram, color: "text-[#e1306c]" },
    { name: "X", icon: XLogo, href: `${PROFILE.contact.x}`, color: "text-foreground" },
  ];

  return (
    <section aria-label="Contact" className="relative bg-background pt-24 md:pt-32 pb-12 px-6 md:px-20 overflow-hidden border-t border-foreground/5">
      {/* Background Torii Silhouette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140vw] h-[70vh] opacity-[0.02] pointer-events-none select-none z-0" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-foreground">
          <path d="M5,25 Q50,15 95,25 L95,32 Q50,22 5,32 Z M20,32 L20,100 M80,32 L80,100 M15,50 L85,50" />
        </svg>
      </div>

      {/* Background 終わり in massive faded text */}
      <div
        className="absolute right-0 bottom-10 vertical-text font-black text-[20vw] opacity-[0.03] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        終わり
      </div>

      {/* Decorative speed lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/3 to-transparent" />
        <div className="absolute top-[60%] left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
        <div className="absolute top-[85%] left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/3 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Brand Column */}
          <div className="flex flex-col">
            <FadeIn y={30} duration={0.8} ease={MOTION_EASE} margin="0px">

              {/* Sized to its column: the fixed text-9xl ran past the half-width
                  column into the form on every desktop width */}
              <h2 className="font-display text-[clamp(2rem,10.5vw,5rem)] lg:text-[clamp(3rem,4.8vw,8rem)] font-black uppercase leading-[0.8] mb-12 tracking-tighter">
                Forge <br /> <span className="text-primary italic">Together.</span>
              </h2>
              <p className="mb-8 max-w-xl text-base md:text-lg text-foreground/60 font-light leading-relaxed">
                Hiring for a security role, need a security review, or want training for your team? Send me a message — I reply within a day or two. E-mail is the fastest way to reach me.
              </p>

              {/* Direct email: the one channel a recruiter usually wants,
                  readable and copyable without opening anything. */}
              <div className="mb-6 flex flex-wrap items-stretch gap-3">
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex min-w-0 items-center gap-3 px-5 py-3 border border-primary/30 bg-primary/[0.06] hover:border-primary transition-colors duration-300"
                >
                  <Mail size={18} className="shrink-0 text-primary-ink" aria-hidden="true" />
                  <span className="truncate font-mono text-sm text-foreground">{EMAIL}</span>
                </a>
                <button
                  type="button"
                  onClick={() => void copyEmail(EMAIL)}
                  className="flex items-center gap-2 px-4 py-3 border border-foreground/10 bg-foreground/5 hover:border-primary/40 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-foreground/80 transition-colors duration-300"
                  aria-label={emailCopy === "done" ? "Email address copied" : "Copy email address"}
                >
                  {emailCopy === "done" ? <Check size={14} className="text-tertiary" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {emailCopy === "done" ? "Copied" : emailCopy === "error" ? "Copy failed" : "Copy"}
                </button>
              </div>

              {/* Social Links  sharp-edged tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-5 py-3 bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-all duration-300 text-foreground/80 hover:text-foreground"
                  >
                    {/* Brand colour on the icon only: LinkedIn blue or YouTube
                        red as 10px text fell below 4.5:1 on the dark theme. */}
                    <social.icon size={18} className={social.color} aria-hidden="true" />
                    <span className="font-mono font-bold uppercase tracking-[0.15em] text-[0.625rem]">
                      {social.name}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0"
                    />
                  </a>
                ))}
              </div>

              {/* Languages  from portfolio data */}
              <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] tracking-[0.25em] uppercase">
                {PORTFOLIO_DATA.languages.map((l, i) => (
                  <span key={l.code} className="flex items-center gap-3">
                    {i > 0 && (
                      <span className="text-primary-ink" aria-hidden="true">
                        •
                      </span>
                    )}
                    <span className="text-foreground/60">
                      {l.code}  {l.level}
                    </span>
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Form Column  Mission Briefing style */}
          <FadeIn
            y={40}
            duration={0.8}
            delay={0.2}
            ease={MOTION_EASE}
            margin="0px"
            className="relative bg-surface/60 backdrop-blur-xl border border-foreground/5 p-8 md:p-12 group"
          >
            {/* Corner bracket accents */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/40" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/40" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/40" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/40" />

            {/* The stamp: lands on the form when the mail app opens. Not
                "sent" — the visitor still presses send in their mail app. */}
            <AnimatePresence>
              {stamp > 0 && (
                <motion.div
                  key={stamp}
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 1.6, rotate: -16 }}
                  animate={{ opacity: 1, scale: 1, rotate: -8 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.53, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute right-6 top-6 z-20 border-2 border-primary px-4 py-2 font-mono text-[0.6875rem] font-black uppercase tracking-[0.35em] text-primary-ink bg-background/80"
                >
                  Ready to send <span className="brush-jp ml-2 text-base tracking-normal" lang="ja">送信</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background mail icon */}
            <div className="absolute top-4 right-4 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
              <Mail size={120} className="text-primary-ink" />
            </div>

            {/* Briefing header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[0.5625rem] text-primary-ink tracking-[0.4em] uppercase font-bold">
                Send a message // 依頼
              </span>
            </div>
            <h3 className="font-display text-3xl font-black mb-3 uppercase tracking-tight text-foreground">
              Write to me
            </h3>
            <p className="font-mono text-[0.6875rem] text-foreground/60 tracking-wider mb-8">
              {PROFILE.availability} — training and collaborations welcome too.
            </p>

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);
                /* Honeypot: people never see this field, bots fill it */
                if (formData.get("botcheck")) return;

                const name = formData.get("name")?.toString() || "";
                const email = formData.get("email")?.toString() || "";
                const type = formData.get("type")?.toString() || "project";
                const message = formData.get("message")?.toString() || "";

                const subject = encodeURIComponent(`[${type}] Inquiry from ${name}`);
                const fullBody = `Sender: ${name} (${email})\nType: ${type}\n\n${message}`;
                const body = encodeURIComponent(fullBody);

                const mailto = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

                setDraft({ subject: `[${type}] Inquiry from ${name}`, body: fullBody });
                setStamp((n) => n + 1);
                window.location.assign(mailto);
              }}
            >
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="relative">
                <label htmlFor="name" className="sr-only">
                  Your name or company
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-all duration-300 text-lg font-light placeholder:text-foreground/60 font-mono"
                  placeholder="Your name or company"
                />
              </div>
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-all duration-300 text-lg font-light placeholder:text-foreground/60 font-mono"
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <label htmlFor="type" className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-foreground/60">
                  Reason
                </label>
                <select
                  id="type"
                  name="type"
                  className="mt-2 w-full bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-all duration-300 text-base font-mono text-foreground/80 [&>option]:bg-surface"
                  defaultValue="Job opportunity"
                >
                  <option>Job opportunity</option>
                  <option>GRC / security assessment</option>
                  <option>Training / course</option>
                  <option>Collaboration</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="relative">
                <label htmlFor="message" className="sr-only">
                  Project details
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  className="w-full bg-transparent border-b border-foreground/10 py-4 focus:outline-none focus:border-primary transition-all duration-300 text-lg font-light resize-none placeholder:text-foreground/60 font-mono"
                  placeholder="What do you need? The role or the project, the timeline, any links"
                />
              </div>
              <button
                type="submit"
                className="btn-sheen relative overflow-hidden mt-4 w-full py-5 bg-primary text-white font-mono font-black uppercase tracking-[0.3em] text-sm hover:bg-foreground hover:text-background transition-all duration-300"
              >
                <span className="relative">DISPATCH MESSAGE</span>
              </button>

              {/* A static site has no server to send mail: the button opens
                  the visitor's mail app. When none is set up nothing visible
                  happens, so the same message is offered two other ways. */}
              <AnimatePresence>
                {draft && (
                  <motion.div
                    initial={{ opacity: 0, y: -7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                    className="border-l-2 border-primary bg-foreground/[0.03] px-5 py-4"
                  >
                    <p className="font-mono text-[0.6875rem] leading-relaxed text-foreground/70">
                      Your e-mail app should now be open with the message ready to send. Nothing opened? Use one of these instead:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={gmailComposeUrl(draft)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] hover:bg-foreground hover:text-background transition-colors duration-300"
                      >
                        Open in Gmail <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={() => void copyDraft(`To: ${EMAIL}\nSubject: ${draft.subject}\n\n${draft.body}`)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em] text-foreground/80 hover:border-primary/40 transition-colors duration-300"
                      >
                        {draftCopy === "done" ? <Check size={12} className="text-tertiary" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                        {draftCopy === "done" ? "Copied" : "Copy message"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
