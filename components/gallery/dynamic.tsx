"use client";

/* The gallery as its own chunk (next/dynamic only code-splits when called
   from a Client Component); app/gallery/page.tsx mounts it lazily. */

import dynamic from "next/dynamic";

export const ArtGallery = dynamic(() => import("@/components/gallery/ArtGallery"));
