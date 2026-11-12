"use client";

/*
 * ═══ components/layout/SiteNav.tsx — the TOP NAVIGATION BAR ═══
 * Sensei-Dev's navbar, with Ahmed's links. On every page (the home page
 * renders it in app/page.tsx, the other pages in components/layout/PageShell.tsx).
 *
 *   • Plain #links on the home page. On the other pages the same links open
 *     the home page at that section (/#work), with no prefetching.
 *   • The section you are reading is lit (IntersectionObserver), or "Blog"
 *     on a case page.
 *   • Phones / tablets / laptops under 1280px: a full-screen menu.
 *
 * Add / rename / reorder a link → navItems below (the #id must exist on the
 * home page; icon = any lucide-react icon; katakana = the small word under
 * it in the phone menu).
 */

import { AnimatePresence, m as motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentProps } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LAZY_MOUNTED } from "@/lib/perf/schedule";
import {
  Menu,
  X,
  Home,
  Briefcase,
  Code2,
  Wrench,
  Route,
  ShieldCheck,
  CircleHelp,
  Mail,
  BookOpen,
  Images,
  Command,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "#home", icon: Home, katakana: "ホーム" },
  { name: "Projects", href: "#work", icon: Code2, katakana: "仕事" },
  { name: "Tools", href: "#tools", icon: Wrench, katakana: "道具" },
  { name: "Experience", href: "#experience", icon: Briefcase, katakana: "経験" },
  { name: "Path", href: "#path", icon: Route, katakana: "道程" },
  { name: "Process", href: "#process", icon: ShieldCheck, katakana: "手順" },
  { name: "FAQ", href: "#faq", icon: CircleHelp, katakana: "質問" },
  { name: "Contact", href: "#contact", icon: Mail, katakana: "連絡" },
  { name: "Blog", href: "#blog", icon: BookOpen, katakana: "記録" },
  { name: "Gallery", href: "#gallery", icon: Images, katakana: "証明" },
];

/* #work on the home page; /#work (the home page, at that section) elsewhere */
function NavAnchor({ onHome, href, ...rest }: { onHome: boolean; href: string } & Omit<ComponentProps<"a">, "href">) {
  return onHome ? <a href={href} {...rest} /> : <Link href={`/${href}`} prefetch={false} {...rest} />;
}

export default function SiteNav() {
  const onHome = (usePathname() || "/") === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const current = onHome ? active : "#blog";

  useEffect(() => {
    if (!onHome) return;
    const ids = navItems.map((i) => i.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    /* Lazy sections replace their placeholder when they load, so the
       elements are looked up again whenever one mounts (lib/perf/lazy.tsx) */
    const watch = () =>
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    watch();
    window.addEventListener(LAZY_MOUNTED, watch);
    return () => {
      observer.disconnect();
      window.removeEventListener(LAZY_MOUNTED, watch);
    };
  }, [onHome]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ─── Main Navigation Bar ─── */}
      <nav
        data-site-header="true"
        className="fixed z-[100] left-1/2 -translate-x-1/2 backdrop-blur-xl bg-background/60 border border-foreground/10 px-4 md:px-8 py-2 md:py-3 flex items-center justify-between"
        style={{
          width: "95%",
          top: 20,
          borderTop: "2px solid var(--primary)",
          clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)",
        }}
      >
        {/* Logo */}
        <NavAnchor
          onHome={onHome}
          href="#home"
          className="font-display font-bold text-lg md:text-xl tracking-tighter cursor-pointer flex items-center group shrink-0"
          aria-label="AE. — Ahmed Emad Nasr, home"
        >
          <span className="text-foreground group-hover:text-primary-ink transition-colors duration-300">
            AE
          </span>
          <span className="text-primary text-2xl leading-none">.</span>
        </NavAnchor>

        {/* Desktop Menu — from 1280px: ten links need the width */}
        <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
          {navItems.map((item) => (
            <NavAnchor
              onHome={onHome}
              key={item.name}
              href={item.href}
              aria-current={current === item.href ? "page" : undefined}
              className={`relative flex min-h-11 items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.1em] transition-colors duration-200 group ${
                current === item.href ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <item.icon
                size={14}
                strokeWidth={1.75}
                aria-hidden="true"
                className={`hidden 2xl:block transition-colors duration-300 ${current === item.href ? "text-primary-ink" : "text-foreground/30 group-hover:text-primary-ink"}`}
              />
              <span>{item.name}</span>
              {/* Red dot indicator */}
              <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-none transition-opacity duration-300 ${current === item.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
            </NavAnchor>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="flex xl:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex min-h-11 min-w-11 items-center justify-center p-2 text-foreground/60 hover:text-primary-ink transition-colors z-[110]"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop theme toggle */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("sensei:palette"))}
            aria-label="Open command palette (Ctrl+K)"
            title="Commands (Ctrl+K)"
            className="flex items-center gap-1.5 border border-foreground/10 bg-foreground/[0.03] px-2.5 py-2.5 font-mono text-[11px] text-foreground/60 transition-colors duration-300 hover:border-primary hover:text-primary-ink"
          >
            <Command size={14} />
            <kbd>K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* ─── Mobile Full-Screen Overlay ───
          The bar stays on top of it, and its menu button turns into the
          close button. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[95] xl:hidden bg-background/95 backdrop-blur-2xl flex flex-col overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            {/* Background Decorative Kanji */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <span className="text-foreground/[0.02] text-[40vw] font-black leading-none">
                武
              </span>
            </div>
            <div
              className="absolute top-20 right-8 pointer-events-none select-none vertical-text text-foreground/[0.04] text-4xl font-black"
              aria-hidden="true"
            >
              <span>侍</span>
              <span>道</span>
              <span>魂</span>
            </div>

            {/* Red accent lines */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/30" />
            <div className="absolute top-0 left-8 w-[2px] h-full bg-foreground/[0.03]" />

            {/* Navigation Items */}
            <div
              className="flex flex-col [justify-content:safe_center] flex-1 px-6 sm:px-10 pt-24 pb-10 gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + idx * 0.07,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="border-b border-foreground/5 last:border-b-0"
                >
                  <NavAnchor
                    onHome={onHome}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex items-center gap-4 sm:gap-6 py-4"
                  >
                    {/* Index Number */}
                    <span className="font-mono text-[11px] text-foreground/60 w-6 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <item.icon
                      size={24}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 text-foreground/15 group-hover:text-primary-ink transition-colors duration-300"
                    />

                    {/* Name - large katakana style */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-display text-[clamp(1.375rem,7.2vw,1.875rem)] font-black text-foreground uppercase tracking-tight group-hover:text-primary-ink transition-colors duration-300">
                        {item.name}
                      </span>
                      <span className="font-mono text-[11px] text-foreground/60 tracking-[0.16em]" lang="ja">
                        {item.katakana}
                      </span>
                    </div>

                    {/* Red accent on hover */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-[2px] bg-primary group-hover:w-6 transition-all duration-300" />
                  </NavAnchor>
                </motion.div>
              ))}

              {/* Bottom tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex flex-col gap-3"
              >
                <div className="w-16 h-[2px] bg-primary" />
                <span className="text-[11px] font-mono text-foreground/60 tracking-[0.16em] uppercase">
                  Ahmed Emad Nasr
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
