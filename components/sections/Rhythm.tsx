"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/motion/Section";
import { scrollStore } from "@/lib/scroll-store";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const BEATS = [
  { word: "SQUAT", cue: "DRIVE THROUGH THE FLOOR" },
  { word: "PRESS", cue: "LOCK IT OVERHEAD" },
  { word: "LIFT", cue: "HINGE. BRACE. STAND." },
  { word: "PUSH", cue: "ONE MORE THAN LAST WEEK" },
];

/**
 * THE COUNT — the rhythmic section.
 *
 * Four screens of scroll, one word each. The word does not fade between beats:
 * it is thrown out and the next is driven in on the impact curve, and the same
 * boundary fires a velocity impulse into the 3D director so the dumbbell slams
 * to a new pose and rings out. Scrolling is the tempo — the reps happen at
 * whatever speed you turn the wheel.
 *
 * The section paints no background, so the WebGL layer shows straight through.
 */
export default function Rhythm() {
  const [beat, setBeat] = useState(0);
  const [within, setWithin] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // Only four state changes across four screens — cheap enough for React,
    // unlike the per-frame values, which stay in the store.
    const update = () => {
      const p = scrollStore.pinProgress("rhythm");
      const next = Math.min(BEATS.length - 1, Math.max(0, Math.floor(p * BEATS.length)));
      setBeat((cur) => (cur === next ? cur : next));
      setWithin(p * BEATS.length - next);
    };
    update();
    return scrollStore.subscribe(update);
  }, []);

  const current = BEATS[beat];

  return (
    <Section id="rhythm" className="h-[400vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Beat ladder — the only persistent UI, so you always know where in the
            set you are without the word having to tell you. */}
        <ol className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 space-y-5 sm:block lg:left-10">
          {BEATS.map((b, i) => (
            <li key={b.word} className="flex items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  "block h-px transition-all duration-[--duration-ui] ease-[--ease-heavy]",
                  i === beat ? "w-10 bg-volt" : "w-4 bg-rule",
                )}
              />
              <span
                className={cn(
                  "label transition-colors duration-[--duration-ui]",
                  i === beat ? "label-volt" : "text-smoke",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>

        <div className={cn("shell relative w-full", reduced ? "text-left" : "text-center")}>
          {reduced ? (
            /* Left-aligned and width-capped: with motion off the object holds
               its static pose on the right, and a centred list runs straight
               into it. */
            <div className="max-w-xl space-y-6">
              {BEATS.map((b) => (
                <p key={b.word} className="display display-md text-bone">
                  {b.word}
                  <span className="ml-4 align-middle font-mono text-xs tracking-[0.2em] text-smoke">
                    {b.cue}
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={current.word}
                initial={{ y: "26%", opacity: 0, scale: 0.86 }}
                animate={{ y: "0%", opacity: 1, scale: 1 }}
                exit={{ y: "-22%", opacity: 0, scale: 1.14 }}
                // Fast in, held, thrown out: the shape of a rep, not a crossfade.
                transition={{ duration: 0.52, ease: EASE.impact }}
                className="will-change-transform"
              >
                <p className="display text-[clamp(4rem,20vw,18rem)] leading-[0.8] text-bone">
                  {current.word}
                </p>
                <p className="label mt-6">{current.cue}</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Rep tempo bar — fills across each individual beat, then resets. */}
        {!reduced && (
          <div className="absolute bottom-12 left-0 w-full">
            <div className="shell flex items-center gap-4">
              <span className="label shrink-0">
                REP {String(beat + 1).padStart(2, "0")} / {BEATS.length}
              </span>
              <span className="relative h-px flex-1 bg-rule">
                <span
                  className="absolute inset-y-0 left-0 block bg-volt"
                  style={{ width: `${within * 100}%` }}
                />
              </span>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
