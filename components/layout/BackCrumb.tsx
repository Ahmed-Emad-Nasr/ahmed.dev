/*
 * ═══ components/layout/BackCrumb.tsx — the "← Back / Where you are" line ═══
 *
 * The small line above a page title, as on the case and video pages:
 *   <BackCrumb href="/blog" label="All cases" current="ATT&CK" />
 */

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackCrumb({ href, label, current }: { href: string; label: string; current: string }) {
  return (
    <nav className="mb-10 flex flex-wrap items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.3em]" aria-label="Breadcrumb">
      <Link prefetch={false} href={href} className="group flex items-center gap-2 text-primary-ink hover:text-foreground transition-colors duration-300">
        <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-[3.4px] rtl:-scale-x-100 rtl:group-hover:translate-x-[3.4px]" aria-hidden="true" />
        {label}
      </Link>
      <span className="text-foreground/20" aria-hidden="true">/</span>
      <span className="text-foreground/60">{current}</span>
    </nav>
  );
}
