"use client";

import { motion, useTransform } from "framer-motion";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { useSectionProgress } from "@/lib/use-section-progress";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * ACT 2 — STRENGTH.
 *
 * A tall section with a sticky viewport inside it, so the type can be worked on
 * for two screens of scroll without any pin library. The headline is built in
 * three beats that trade places as you descend: STRENGTH IS BUILT rises and
 * shrinks out of the way, NOT GIVEN drives up to take the frame, and the
 * industrial grid fades in underneath as the dumbbell crosses the page behind it.
 */
export default function Strength() {
  const p = useSectionProgress("strength", "pin");
  const reduced = usePrefersReducedMotion();

  const gridOpacity = useTransform(p, [0, 0.25, 0.8, 1], [0, 0.5, 0.5, 0.12]);
  const gridScale = useTransform(p, [0, 1], [1.18, 1]);

  const aY = useTransform(p, [0, 0.55], ["0%", "-42%"]);
  const aScale = useTransform(p, [0, 0.55], [1, 0.72]);
  const aOpacity = useTransform(p, [0.32, 0.55], [1, 0.18]);

  const bY = useTransform(p, [0.3, 0.72], ["70%", "0%"]);
  const bOpacity = useTransform(p, [0.3, 0.46], [0, 1]);
  const bClip = useTransform(p, [0.3, 0.72], ["inset(0 0 100% 0)", "inset(0 0 -10% 0)"]);

  // The headline block rises by 42% of its own height, which carries it straight
  // over the section label. The label leaves before it gets there.
  const labelOpacity = useTransform(p, [0, 0.16], [1, 0]);

  const noteX = useTransform(p, [0.55, 0.9], ["6rem", "0rem"]);
  const noteOpacity = useTransform(p, [0.58, 0.82], [0, 1]);

  const s = (mv: unknown) => (reduced ? undefined : (mv as never));

  return (
    <Section id="strength" className="h-[260vh]">
      {/* Grid + vignette live behind the type but in front of nothing — the WebGL
          layer shows through, which is how the dumbbell appears to be *in* the room */}
      <div
        aria-hidden
        className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] w-full overflow-hidden"
      >
        <motion.div
          className="h-full w-full grid-lines edge-fade-b"
          style={{ opacity: s(gridOpacity) ?? 0.4, scale: s(gridScale) ?? 1 }}
        />
      </div>

      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="shell relative">
          <motion.div style={{ opacity: s(labelOpacity) ?? 1 }}>
            <SectionLabel index="01" className="mb-10">
              THE PRINCIPLE
            </SectionLabel>
          </motion.div>

          <div className="relative">
            <motion.div
              className="will-change-transform"
              style={{
                y: s(aY),
                scale: s(aScale),
                opacity: s(aOpacity),
                transformOrigin: "left top",
              }}
            >
              <h2 className="display display-lg text-bone">
                STRENGTH
                <br />
                IS BUILT.
              </h2>
            </motion.div>

            <motion.div
              className="mt-4 will-change-transform"
              style={{
                y: s(bY),
                opacity: s(bOpacity),
                clipPath: s(bClip),
                transformOrigin: "left top",
              }}
            >
              <p className="display display-lg text-volt">NOT GIVEN.</p>
            </motion.div>
          </div>

          <motion.div
            className="mt-14 max-w-md border-l border-rule pl-6"
            style={{ x: s(noteX), opacity: s(noteOpacity) ?? 1 }}
          >
            <p className="body-lg">
              Nobody arrives strong. It is assembled — one honest set at a time, under
              load, on days you would rather not. We build the conditions for that:
              the equipment, the coaching, and a room that expects you back.
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
