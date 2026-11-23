"use client";

/*
 * ═══ components/home/HeroMascot.tsx — the two mascots beside the portrait ═══
 *
 * Six hand-drawn SVG characters, three for each side of the portrait. One
 * shows on the LEFT (owl, cat or fox) and one on the RIGHT (daruma, tanuki or
 * robot): a random one of its three on every visit, and a click switches it
 * to the next one of its side with a bounce. Both float gently up and down.
 *
 * HOW TO ADD A MASCOT: draw an SVG (viewBox 0 0 100 100) as a const like OWL
 * below, then add { id, name, role, art } to the LEFT or RIGHT list.
 * Where they sit → the two classNames in <HeroMascots> at the bottom.
 * Speed of the float → `duration: 4.5` in <MascotSlot>.
 */

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { m as motion, useAnimationControls } from "framer-motion";
import { useReducedMotion } from "@/lib/use-client";

type Side = "left" | "right";

interface Mascot {
  id: string;
  name: string;
  role: string;
  art: ReactNode;
}

/*
 * Original artwork, drawn for this site as inline SVG (no image requests).
 * Same idea as the Sensei-Dev language mascots, but for the blue team:
 * the night-shift owl, the threat-hunting fox, a log-watching cat, a honeypot
 * tanuki, a SOAR robot and a never-give-up daruma.
 */
const OWL = (
  <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden="true">
    <path d="M22 30 L30 12 L40 26 Z" fill="#3a3a3a" />
    <path d="M78 30 L70 12 L60 26 Z" fill="#3a3a3a" />
    <ellipse cx="50" cy="58" rx="32" ry="36" fill="#2b2b2b" />
    <ellipse cx="50" cy="70" rx="20" ry="22" fill="#4a4a4a" />
    <path
      d="M36 72 q4 4 8 0 M46 78 q4 4 8 0 M56 72 q4 4 8 0"
      stroke="#2b2b2b"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="37" cy="44" r="12" fill="#f4f1ea" />
    <circle cx="63" cy="44" r="12" fill="#f4f1ea" />
    <circle cx="38" cy="45" r="6" fill="#FFD700" />
    <circle cx="62" cy="45" r="6" fill="#FFD700" />
    <circle cx="38" cy="45" r="3" fill="#111" />
    <circle cx="62" cy="45" r="3" fill="#111" />
    <path d="M46 52 L54 52 L50 60 Z" fill="#BC002D" />
    <rect x="22" y="86" width="56" height="5" fill="#BC002D" />
  </svg>
);

const FOX = (
  <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden="true">
    <path d="M16 16 L40 34 L22 50 Z" fill="#e8742a" />
    <path d="M84 16 L60 34 L78 50 Z" fill="#e8742a" />
    <path d="M21 22 L33 33 L24 41 Z" fill="#2b1a10" />
    <path d="M79 22 L67 33 L76 41 Z" fill="#2b1a10" />
    <path d="M18 40 Q50 18 82 40 L64 82 Q50 92 36 82 Z" fill="#f08a3c" />
    <path d="M24 50 Q38 58 50 86 Q34 84 28 70 Z" fill="#fbf5ec" />
    <path d="M76 50 Q62 58 50 86 Q66 84 72 70 Z" fill="#fbf5ec" />
    <path
      d="M34 52 q6 -5 12 0"
      stroke="#1a1a1a"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M54 52 q6 -5 12 0"
      stroke="#1a1a1a"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="50" cy="80" rx="5" ry="4" fill="#1a1a1a" />
    <path
      d="M44 24 L50 30 L56 24"
      stroke="#BC002D"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

const NEKO = (
  <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden="true">
    <path d="M20 40 L24 10 L45 28 Z" fill="#2b2b2b" />
    <path d="M80 40 L76 10 L55 28 Z" fill="#2b2b2b" />
    <path d="M26 31 L28 18 L37 27 Z" fill="#BC002D" />
    <path d="M74 31 L72 18 L63 27 Z" fill="#BC002D" />
    <ellipse cx="50" cy="60" rx="34" ry="30" fill="#3a3a3a" />
    <ellipse cx="36" cy="55" rx="9" ry="10" fill="#FFD700" />
    <ellipse cx="64" cy="55" rx="9" ry="10" fill="#FFD700" />
    <ellipse cx="36" cy="55" rx="2.6" ry="8" fill="#111" />
    <ellipse cx="64" cy="55" rx="2.6" ry="8" fill="#111" />
    <circle cx="39" cy="51" r="2" fill="#f4f1ea" />
    <circle cx="67" cy="51" r="2" fill="#f4f1ea" />
    <path d="M46 67 L54 67 L50 72 Z" fill="#BC002D" />
    <path
      d="M50 72 q-5 6 -11 2 M50 72 q5 6 11 2"
      stroke="#f4f1ea"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M14 62 L30 65 M14 70 L30 69 M86 62 L70 65 M86 70 L70 69"
      stroke="#8a8a8a"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M24 84 Q50 98 76 84"
      stroke="#BC002D"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="50" cy="93" r="4.5" fill="#FFD700" />
    <path d="M48 93 h4" stroke="#8a6d00" strokeWidth="1.4" />
  </svg>
);

const TANUKI = (
  <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden="true">
    <circle cx="24" cy="30" r="12" fill="#6b4f3a" />
    <circle cx="76" cy="30" r="12" fill="#6b4f3a" />
    <circle cx="24" cy="31" r="6" fill="#2b1a10" />
    <circle cx="76" cy="31" r="6" fill="#2b1a10" />
    <ellipse cx="50" cy="58" rx="36" ry="32" fill="#9a7452" />
    <path d="M22 50 Q36 38 46 54 Q40 70 26 66 Q18 60 22 50 Z" fill="#2b1a10" />
    <path d="M78 50 Q64 38 54 54 Q60 70 74 66 Q82 60 78 50 Z" fill="#2b1a10" />
    <ellipse cx="50" cy="72" rx="20" ry="16" fill="#efdfc2" />
    <circle cx="35" cy="54" r="5.5" fill="#f4f1ea" />
    <circle cx="65" cy="54" r="5.5" fill="#f4f1ea" />
    <circle cx="36" cy="55" r="3" fill="#111" />
    <circle cx="64" cy="55" r="3" fill="#111" />
    <ellipse cx="50" cy="66" rx="6" ry="4.5" fill="#1a1a1a" />
    <path
      d="M50 70 v4 M50 74 q-5 5 -10 1 M50 74 q5 5 10 1"
      stroke="#2b1a10"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M50 12 Q68 16 64 31 Q50 32 44 20 Z" fill="#6aa84f" />
    <path
      d="M50 14 Q55 22 57 28"
      stroke="#3f7a2f"
      strokeWidth="1.6"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const KARAKURI = (
  <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden="true">
    <path d="M50 20 V9" stroke="#8a8a8a" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="8" r="5" fill="#BC002D" />
    <rect x="10" y="46" width="8" height="22" rx="3" fill="#8a8a8a" />
    <rect x="82" y="46" width="8" height="22" rx="3" fill="#8a8a8a" />
    <rect x="16" y="20" width="68" height="60" rx="16" fill="#4a4a4a" />
    <rect x="24" y="30" width="52" height="38" rx="11" fill="#1d1d1d" />
    <rect x="31" y="40" width="14" height="14" rx="5" fill="#5ad1ff" />
    <rect x="55" y="40" width="14" height="14" rx="5" fill="#5ad1ff" />
    <rect x="34" y="43" width="5" height="5" rx="2" fill="#f4f1ea" />
    <rect x="58" y="43" width="5" height="5" rx="2" fill="#f4f1ea" />
    <path
      d="M38 61 h24"
      stroke="#5ad1ff"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeDasharray="4 3"
    />
    <rect x="38" y="82" width="24" height="10" rx="3" fill="#3a3a3a" />
    <circle cx="50" cy="87" r="2.4" fill="#BC002D" />
  </svg>
);

const DARUMA = (
  <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden="true">
    <path
      d="M50 8 C82 8 92 40 90 62 C88 84 72 94 50 94 C28 94 12 84 10 62 C8 40 18 8 50 8 Z"
      fill="#BC002D"
    />
    <path d="M50 14 C74 14 82 38 80 52 L20 52 C18 38 26 14 50 14 Z" fill="#a8002a" />
    <ellipse cx="50" cy="44" rx="28" ry="23" fill="#f4f1ea" />
    <path
      d="M24 28 q10 -10 22 -2 M76 28 q-10 -10 -22 -2"
      stroke="#111"
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="38" cy="42" r="7" fill="#fff" stroke="#111" strokeWidth="1.6" />
    <circle cx="62" cy="42" r="7" fill="#fff" stroke="#111" strokeWidth="1.6" />
    <circle cx="63" cy="43" r="3.6" fill="#111" />
    <path
      d="M30 58 q10 12 20 4 q10 8 20 -4"
      stroke="#111"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M35 66 q15 12 30 0"
      stroke="#111"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M20 80 Q50 90 80 80"
      stroke="#FFD700"
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M30 84 l2 4 M42 87 l1 4 M55 87 l-1 4 M68 84 l-2 4"
      stroke="#FFD700"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* The three mascots of each side, in click order. name + role appear in the
   hover label. */
const LEFT: Mascot[] = [
  { id: "owl", name: "Fukurou", role: "Night shift", art: OWL },
  { id: "neko", name: "Neko", role: "Log watch", art: NEKO },
  { id: "fox", name: "Kitsune", role: "Threat hunt", art: FOX },
];

const RIGHT: Mascot[] = [
  { id: "daruma", name: "Daruma", role: "Never quits", art: DARUMA },
  { id: "tanuki", name: "Tanuki", role: "Honeypot", art: TANUKI },
  { id: "karakuri", name: "Karakuri", role: "SOAR bot", art: KARAKURI },
];

/* The random first mascot of each side, picked once per page load in the
   browser. The server HTML (and hydration) always use the first one;
   useSyncExternalStore then swaps in this pick — no "mount, then setState"
   pass. */
const CLIENT_RANDOM = typeof window === "undefined" ? [0, 0] : [Math.random(), Math.random()];
const noSubscribe = () => () => {};

function MascotSlot({
  mascots,
  side,
  random,
  beat,
  className,
}: {
  mascots: Mascot[];
  side: Side;
  random: number;
  beat: number;
  className?: string;
}) {
  const start = useSyncExternalStore(
    noSubscribe,
    () => Math.floor(random * mascots.length),
    () => 0,
  );
  const [clicks, setClicks] = useState(0);
  const reduced = useReducedMotion();

  const bounce = useAnimationControls();
  const mascot = mascots[(start + clicks) % mascots.length] ?? mascots[0]!;

  /* Click → next mascot of this side + a quick jump (skipped with reduced motion) */
  const play = () => {
    setClicks((c) => c + 1);
    if (!reduced) {
      bounce.start({
        y: [0, -15.3, 0],
        scale: [1, 1.051, 1],
        transition: { duration: 0.3, ease: "easeOut" },
      });
    }
  };

  return (
    <motion.div
      className={className}
      animate={reduced ? {} : { y: [0, -3.6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: beat }}
    >
      <motion.button
        type="button"
        onClick={play}
        animate={bounce}
        title={`${mascot.name} — ${mascot.role}. Click to meet the next one.`}
        aria-label={`${mascot.name}, ${mascot.role} mascot. Activate to meet the next mascot.`}
        className="group relative block w-20 cursor-pointer lg:w-24"
      >
        <span className="block">{mascot.art}</span>
        <span className={`pointer-events-none absolute -bottom-7 ${side === "left" ? "left-0 sm:left-1/2 sm:-translate-x-1/2" : "right-0"} whitespace-nowrap border border-foreground/15 bg-background/90 px-2 py-0.5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100`}>
          {mascot.name} • {mascot.role}
        </span>
      </motion.button>
    </motion.div>
  );
}

/** Put this inside the portrait box (it must be `relative`). */
export function HeroMascots() {
  return (
    <>
      <MascotSlot
        mascots={LEFT}
        side="left"
        random={CLIENT_RANDOM[0] ?? 0}
        beat={0}
        className="absolute -bottom-3 -left-4 z-20 lg:-left-8"
      />
      <MascotSlot
        mascots={RIGHT}
        side="right"
        random={CLIENT_RANDOM[1] ?? 0}
        beat={0.9}
        className="absolute -bottom-3 -right-4 z-20"
      />
    </>
  );
}
