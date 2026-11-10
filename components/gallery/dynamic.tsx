"use client";

/* The gallery as its own chunk (next/dynamic only code-splits when called
   from a Client Component); app/gallery/page.tsx mounts it lazily.
   Same pattern as components/home/dynamic.tsx and components/blog/dynamic.tsx. */

import dynamic from "next/dynamic";

export const ArtGallery = dynamic(() => import("@/components/gallery/ArtGallery"));
