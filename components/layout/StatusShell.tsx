"use client";

/* The page frame (navbar, footer) for the 404 and error pages, as its own
   chunk: Next keeps those pages' code ready on every page, and a plain import
   made a second copy of the navbar and intro loader in the JavaScript every
   page downloads up front. Still rendered into the HTML (ssr). */

import dynamic from "next/dynamic";

const StatusShell = dynamic(() => import("@/components/layout/PageShell"));

export default StatusShell;
