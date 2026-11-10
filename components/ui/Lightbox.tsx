"use client";

/* The screenshot / certificate lightbox. Always imported with next/dynamic,
   so the library and its CSS load only when something is opened.

   ═══ components/ui/Lightbox.tsx — full-screen image viewer ═══
   Wraps the "yet-another-react-lightbox" library. slides = [{ src, title,
   description? }], index = which one opens first. Plugins: Zoom, Fullscreen,
   Thumbnails (remove one from `plugins` to drop that feature). */

import YarlLightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom, Fullscreen, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Slide = { src: string; title: string; description?: string };

export default function Lightbox({ close, index, slides }: { close: () => void; index: number; slides: Slide[] }) {
  return (
    <YarlLightbox
      open
      close={close}
      index={index}
      slides={slides}
      plugins={[Zoom, Fullscreen, Thumbnails]}
      /* --yarl__button_filter: the library draws a drop shadow under its
         toolbar icons by default; the site has no shadows anywhere */
      styles={{
        root: { "--yarl__button_filter": "none" },
        container: { backgroundColor: "rgba(0, 0, 0, 0.98)" },
      }}
    />
  );
}
