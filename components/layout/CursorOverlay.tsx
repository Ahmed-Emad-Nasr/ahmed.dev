"use client";

import { useEffect, useRef, useState } from "react";
import { m as motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/lib/use-client";

/**
 * Katana cursor  your blade for browsing the dojo.
 * States: gold blade (default) → red lock-on (interactive).
 * Desktop fine-pointers only; touch keeps the native cursor.
 *
 * ═══ components/layout/CursorOverlay.tsx — the custom KATANA CURSOR ═══
 * Loaded by CursorMount.tsx. It follows the mouse with a spring (springConfig
 * below: lower stiffness = lazier, more trailing cursor). Over links, buttons
 * and anything with class="interactive" (handleElementHover) the ring turns
 * into red lock-on brackets. Kept light on purpose: one ring and one tip,
 * no text label or trailing ghost, and React re-renders only when the
 * hover state really flips.
 * While it's active, <body> gets the class "custom-cursor-on", which
 * app/globals.css uses to hide the normal system pointer.
 */
export default function CursorOverlay() {
  const [isHovering, setIsHovering] = useState(false);
  /* Fine pointer (mouse) and motion allowed — live, so plugging a mouse in
     or changing the OS motion setting switches it on or off */
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const pendingPosition = useRef({ x: -100, y: -100 });
  const moveFrame = useRef<number | null>(null);

  /* How the cursor trails the real mouse position */
  const springConfig = { damping: 47, stiffness: 940, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor-on");

    const moveCursor = (e: MouseEvent) => {
      pendingPosition.current = { x: e.clientX, y: e.clientY };
      if (moveFrame.current !== null) return;
      moveFrame.current = requestAnimationFrame(() => {
        moveFrame.current = null;
        cursorX.set(pendingPosition.current.x);
        cursorY.set(pendingPosition.current.y);
      });
    };

    let hovering = false;
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const over = Boolean(target?.closest?.("a, button, .interactive"));
      if (over === hovering) return;
      hovering = over;
      setIsHovering(over);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleElementHover);

    return () => {
      document.body.classList.remove("custom-cursor-on");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleElementHover);
      if (moveFrame.current !== null) cancelAnimationFrame(moveFrame.current);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  /* Decoration that follows the pointer — hidden from assistive tech, and
     kept out of the landmark structure (axe "region"). */
  return (
    <div aria-hidden="true" className="contents">
      {/* Outer ring  gold at rest, brackets lock on-hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 64 : 40,
          height: isHovering ? 64 : 40,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 830, damping: 42 }}
      >
        <div
          className={`relative w-full h-full transition-[border-radius,border-color] duration-300 flex items-center justify-center
            ${isHovering ? "rounded-none" : "rounded-full border border-accent/60"}`}
        >
          {/* Red lock-on brackets */}
          <motion.div
            className="absolute inset-[-4px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovering ? 1 : 0,
              scale: isHovering ? 1 : 0.8,
            }}
            transition={{ duration: 0.12 }}
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />
          </motion.div>
        </div>
      </motion.div>

      {/* Blade tip  gold at rest, red on lock-on */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div
          className={`w-2 h-2 rotate-45 transition-colors duration-300 ${isHovering ? "bg-primary" : "bg-accent"}`}
        />
      </motion.div>
    </div>
  );
}
