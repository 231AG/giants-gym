"use client";

import { motion, useTransform } from "framer-motion";
import Section from "@/components/motion/Section";
import { useSectionProgress } from "@/lib/use-section-progress";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * ACT 3 — THE FORGE. The transition, and the piece the whole scene is built for.
 *
 * Across two screens of scroll the camera dollies from 6.1 to 1.32 world units
 * while the dumbbell rotates its plate face square to lens. By ~90% the black
 * rubber face is larger than the frame, so the screen is genuinely, physically
 * black — and the Training section is revealed *through* it rather than cut to.
 * The DOM's only job here is to get out of the way: three words that track the
 * push, and a black plane that takes over for the last 8%.
 */
export default function Forge() {
  const p = useSectionProgress("forge", "pin");
  const reduced = usePrefersReducedMotion();

  const wordScale = useTransform(p, [0, 0.62], [1, 4.6]);
  const wordOpacity = useTransform(p, [0, 0.12, 0.45, 0.62], [0, 1, 1, 0]);
  const wordBlur = useTransform(p, [0.35, 0.62], ["blur(0px)", "blur(14px)"]);

  const ringScale = useTransform(p, [0, 0.7], [0.6, 2.6]);
  const ringOpacity = useTransform(p, [0.05, 0.3, 0.7], [0, 0.35, 0]);

  // The hand-off. Opaque black lands just after the plate already fills the frame,
  // so there is no visible moment where one replaces the other.
  const wipeOpacity = useTransform(p, [0.88, 0.99], [0, 1]);

  const meterScaleX = useTransform(p, [0, 1], [0, 1]);

  const s = (mv: unknown) => (reduced ? undefined : (mv as never));

  return (
    <Section id="forge" className="h-[220vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {reduced ? (
          <div className="flex h-full items-center justify-center">
            <p className="display display-md text-center text-bone">
              CLOSER.
              <br />
              <span className="text-volt">HEAVIER.</span>
            </p>
          </div>
        ) : (
          <>
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-1/2 aspect-square w-[38vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-volt/40"
              style={{ scale: s(ringScale), opacity: s(ringOpacity) }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ scale: s(wordScale), opacity: s(wordOpacity), filter: s(wordBlur) }}
            >
              <p className="display text-center text-[clamp(2rem,7vw,6rem)] leading-[0.9] text-bone">
                CLOSER.
                <br />
                <span className="text-volt">HEAVIER.</span>
              </p>
            </motion.div>
          </>
        )}

        {/* Load meter — the only UI that survives the push, and it is what tells
            you the movement you are watching is being driven by your own scroll. */}
        <div className="pointer-events-none absolute bottom-10 left-0 w-full">
          <div className="shell flex items-center gap-4">
            <span className="label shrink-0">LOAD</span>
            <span className="relative h-px flex-1 bg-rule">
              <motion.span
                className="absolute inset-y-0 left-0 block origin-left bg-volt"
                style={{ width: "100%", scaleX: s(meterScaleX) ?? 1 }}
              />
            </span>
            <span className="label shrink-0">MAX</span>
          </div>
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-void"
          style={{ opacity: s(wipeOpacity) ?? 0 }}
        />
      </div>
    </Section>
  );
}
