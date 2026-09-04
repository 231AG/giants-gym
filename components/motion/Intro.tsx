"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrollStore } from "@/lib/scroll-store";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { willPlayIntro, markIntroSeen } from "@/lib/intro-state";
import { site } from "@/config/site";

/**
 * The opening sequence.
 *
 *   black ── a lime bar slams across the screen ── GIANTS is struck through it
 *   ── the curtain splits from that bar and drives apart ── hand off to the hero
 *
 * It is a *curtain*, not a loader: nothing is being waited on. The page beneath
 * is already interactive, the 3D layer is loading behind it, and the whole thing
 * is over in ~2.1s. `introProgress` is published to the scroll store as the
 * curtain opens, which is what cues the dumbbell to fly in from off-stage right.
 */

type Phase = "black" | "impact" | "word" | "open" | "done";

export default function Intro() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("black");
  const [mounted, setMounted] = useState(false);

  const finish = useCallback(() => {
    setPhase("done");
    scrollStore.introProgress = 1;
    markIntroSeen();
  }, []);

  useEffect(() => {
    setMounted(true);

    if (!willPlayIntro()) {
      scrollStore.introProgress = 1;
      setPhase("done");
      return;
    }

    // Hold the scroll at the top while the curtain is up.
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const timers = [
      window.setTimeout(() => setPhase("impact"), 220),
      window.setTimeout(() => setPhase("word"), 620),
      window.setTimeout(() => {
        setPhase("open");
        // Hand the object its cue a beat before the curtain is fully clear, so it
        // is already in motion when it becomes visible.
        scrollStore.introProgress = 1;
      }, 1480),
      window.setTimeout(finish, 2280),
    ];

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, [reduced, finish]);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  // Let people out early — holding someone hostage to your intro is bad manners.
  useEffect(() => {
    if (phase === "done") return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [phase, finish]);

  if (!mounted) return null;

  const opening = phase === "open";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[90]"
          aria-hidden
          initial={false}
          exit={{ opacity: 0, transition: { duration: 0.28 } }}
        >
          {/* Two halves of the curtain, driven apart from the impact bar */}
          <motion.div
            className="absolute inset-x-0 top-0 bg-void"
            initial={{ height: "50%" }}
            animate={{ y: opening ? "-100%" : "0%" }}
            transition={{ duration: 0.8, ease: EASE.heavy }}
            style={{ height: "50%" }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-void"
            initial={{ height: "50%" }}
            animate={{ y: opening ? "100%" : "0%" }}
            transition={{ duration: 0.8, ease: EASE.heavy }}
            style={{ height: "50%" }}
          />

          {/* The impact: a lime bar thrown across the centre line, fast in, and
              then held as the seam the curtain opens from. */}
          <motion.div
            className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-volt"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: phase === "black" ? 0 : 1,
              opacity: opening ? 0 : 1,
              height: phase === "impact" ? 3 : 2,
            }}
            transition={{ duration: 0.34, ease: EASE.impact }}
            style={{ translateY: "-50%" }}
          />

          {/* GIANTS, struck through by the bar */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="mask-line">
              <motion.span
                className="display block text-center text-bone"
                style={{ fontSize: "clamp(3rem, 13vw, 12rem)" }}
                initial={{ y: "112%" }}
                animate={{
                  y: phase === "word" || opening ? "0%" : "112%",
                  opacity: opening ? 0 : 1,
                  letterSpacing: phase === "word" || opening ? "-0.015em" : "0.12em",
                }}
                transition={{ duration: 0.9, ease: EASE.heavy }}
              >
                {site.shortName}
              </motion.span>
            </span>
          </div>

          <motion.span
            className="label absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "word" ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {site.tagline}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
