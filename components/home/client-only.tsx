"use client";

/*
 * Home parts that render in the browser only (never in the HTML): they
 * depend on the window size or localStorage. next/dynamic's `ssr: false`
 * only works inside a client module — that is why they are here and not in
 * components/home/dynamic.tsx (which stays on the server).
 */

import dynamic from "next/dynamic";

/* The chapter rail (wide screens) + back-to-top button */
export const SectionRail = dynamic(() => import("@/components/home/SectionRail"), { ssr: false });
