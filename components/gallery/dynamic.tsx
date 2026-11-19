/* The gallery as its own chunk (ArtGallery is a client component, so its
   code is split out); the gallery pages mount it.
   Same pattern as components/home/dynamic.tsx and components/blog/dynamic.tsx. */

import dynamic from "next/dynamic";

export const ArtGallery = dynamic(() => import("@/components/gallery/ArtGallery"));
