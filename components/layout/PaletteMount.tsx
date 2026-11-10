"use client";

/* Only this listener ships with the page; the first Ctrl/⌘K (or a
   "sensei:palette" event) loads the palette chunk, which then takes over.

   ═══ components/layout/PaletteMount.tsx — lazy loader for the COMMAND PALETTE ═══
   The palette itself is components/layout/CommandPalette.tsx.
   To open the palette from your own button anywhere on the site:
     window.dispatchEvent(new Event("sensei:palette"))
   (that's what the ⌘ button in the navbar does). */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/layout/CommandPalette"), { ssr: false });

export default function PaletteMount() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setLoaded(true);
      }
    };
    const onOpen = () => setLoaded(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("sensei:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("sensei:palette", onOpen);
    };
  }, [loaded]);

  return loaded ? <CommandPalette /> : null;
}
