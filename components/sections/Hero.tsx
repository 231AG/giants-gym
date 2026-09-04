"use client";

import { motion } from "framer-motion";
import Section from "@/components/motion/Section";
import { MaskLines } from "@/components/motion/MaskReveal";
import Cta from "@/components/ui/Cta";
import { cta, contact } from "@/config/site";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { willPlayIntro, INTRO_DURATION } from "@/lib/intro-state";

const FACTS = [
  { k: "FLOOR", v: "18,500 SQ FT" },
  { k: "PLATFORMS", v: "24" },
  { k: "ACCESS", v: "24 / 7" },
];

/**
 * Hero. Exactly 100vh so the director can derive its act progress from raw
 * scrollY without a measurement round-trip.
 *
 * The type sits left and the WebGL dumbbell occupies the right third — but the
 * background is transparent, so on narrow screens the object simply falls behind
 * the headline instead of needing a second layout.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion();
  // Resolved on mount: `true` on the very first paint so the server and client
  // markup agree, then corrected before any of these delays could have elapsed.
  const [offset, setOffset] = useState(INTRO_DURATION);
  useEffect(() => setOffset(willPlayIntro() ? INTRO_DURATION : 0), []);

  /** Delay, measured from the moment the curtain clears. */
  const d = (n: number) => (reduced ? 0 : offset + n);
  const stagger = reduced ? 0 : offset / 0.085;

  return (
    <Section
      id="hero"
      className="relative flex h-[100svh] min-h-[36rem] flex-col justify-end overflow-hidden"
    >
      {/* Vertical chapter marker — an industrial detail that gives the empty
          right-hand column an edge to sit against. */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d(1), duration: 0.6 }}
        className="label absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block"
      >
        00 <span className="text-volt">/</span> ENTER
      </motion.span>

      <div className="shell relative z-10 flex flex-1 flex-col justify-end pb-8 pt-[var(--nav-h)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(0.1), duration: 0.5 }}
          className="mb-7 flex items-center gap-4"
        >
          <span className="label label-volt">EST. 2019</span>
          <span aria-hidden className="h-px w-8 bg-rule" />
          <span className="label hidden sm:block">{contact.address}</span>
          <span className="label sm:hidden">EAST DOCK</span>
        </motion.div>

        <h1 className="sr-only">Giants Gym — build your giant.</h1>

        <MaskLines
          as="div"
          aria-hidden
          lines={[
            "BUILD",
            "YOUR",
            <>
              GIANT<span className="text-volt">.</span>
            </>,
          ]}
          className="display display-xl text-bone"
          delay={stagger}
        />

        {/* Copy and CTAs stay in one left-hand column so the right two-thirds
            belong entirely to the object. A CTA parked under the dumbbell reads
            as a caption for it rather than the page's primary action. */}
        <div className="mt-10 flex max-w-[34rem] flex-col gap-8 lg:mt-14">
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(0.45), duration: 0.8, ease: EASE.heavy }}
            className="max-w-[22rem] font-mono text-[0.78rem] leading-[2.1] tracking-[0.16em] text-ash"
          >
            TRAIN HARD.
            <br />
            STAY CONSISTENT.
            <br />
            <span className="text-bone">BECOME STRONGER.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d(0.63), duration: 0.8, ease: EASE.heavy }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Cta href={cta.primary.href}>{cta.primary.label}</Cta>
            <Cta href={cta.secondary.href} variant="ghost">
              {cta.secondary.label}
            </Cta>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d(0.85), duration: 0.6 }}
        className="relative z-10 mt-8 border-t border-rule/60"
      >
        <div className="shell flex items-center justify-between gap-6 py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {FACTS.map((f) => (
              <span key={f.k} className="flex items-baseline gap-2.5">
                <span className="label">{f.k}</span>
                <span className="font-mono text-[0.78rem] text-bone">{f.v}</span>
              </span>
            ))}
          </div>
          <span className="hidden items-center gap-3 sm:flex">
            <span className="label">SCROLL</span>
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-rule">
              {!reduced && (
                <motion.span
                  className="absolute inset-x-0 top-0 block h-3 bg-volt"
                  animate={{ y: [-12, 32] }}
                  transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </span>
          </span>
        </div>
      </motion.div>
    </Section>
  );
}
