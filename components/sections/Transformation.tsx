"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { scrollStore } from "@/lib/scroll-store";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const DAYS = [
  { day: "DAY 01", line: "SHOW UP.", note: "The first session is the only one that is purely a decision." },
  { day: "DAY 30", line: "STAY CONSISTENT.", note: "Nothing visible has happened yet. Keep going anyway." },
  { day: "DAY 365", line: "BECOME A GIANT.", note: "A year of honest sets is not a transformation story. It is arithmetic." },
];

/**
 * THE TIMELINE — an editorial progression, deliberately not a testimonial.
 *
 * This is the one place GSAP genuinely earns its place over Framer: a single
 * scrubbed timeline drives eight targets (three number blocks, three copy
 * blocks, a rule that grows and a label that swaps) against one shared clock.
 * Expressing that as per-element `useTransform` ranges would mean hand-keeping a
 * dozen numbers in sync every time the pacing changed.
 *
 * GSAP and ScrollTrigger are imported dynamically, so ~60kB of animation library
 * stays out of the initial bundle and only arrives if this section is reached.
 * ScrollTrigger is refreshed from the shared scroll store rather than its own
 * listener, so it can never disagree with the WebGL director about the position.
 */
export default function Transformation() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);

      // Lenis performs real window scrolling, so ScrollTrigger's own maths are
      // correct — it just needs telling when the smoothed value moves.
      unsubscribe = scrollStore.subscribe(() => ScrollTrigger.update());

      ctx = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>("[data-day]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.1, // lag the scrub: the copy carries momentum like everything else
          },
        });

        tl.fromTo(
          "[data-rule]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", duration: DAYS.length },
          0,
        );

        items.forEach((item, i) => {
          const num = item.querySelector("[data-num]");
          const copy = item.querySelector("[data-copy]");
          const note = item.querySelector("[data-note]");

          tl.fromTo(
            num,
            { yPercent: 60, opacity: 0 },
            { yPercent: 0, opacity: 1, ease: "power3.out", duration: 0.45 },
            i,
          )
            .fromTo(
              copy,
              { yPercent: 110 },
              { yPercent: 0, ease: "power3.out", duration: 0.5 },
              i + 0.06,
            )
            .fromTo(
              note,
              { opacity: 0, x: 24 },
              { opacity: 1, x: 0, ease: "power2.out", duration: 0.4 },
              i + 0.18,
            );

          // Everything but the final entry recedes rather than disappearing —
          // the earlier days stay legible as history behind the current one.
          if (i < DAYS.length - 1) {
            tl.to(item, { opacity: 0.22, ease: "none", duration: 0.4 }, i + 0.6);
          }
        });
      }, root);

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <Section id="transformation" className="relative z-10 bg-void">
      <div ref={root} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="shell w-full">
            <SectionLabel index="05" className="mb-12">
              THE LONG GAME
            </SectionLabel>

            <div className="relative grid gap-10 sm:grid-cols-[auto_1fr] sm:gap-14">
              {/* The rule that grows as the year passes */}
              <div className="absolute left-0 top-0 hidden h-full w-px bg-rule sm:block">
                <span
                  data-rule
                  className="absolute inset-0 block origin-top bg-volt"
                  style={{ transform: reduced ? "scaleY(1)" : "scaleY(0)" }}
                />
              </div>

              <div className="sm:pl-14">
                <ul className="space-y-12 sm:space-y-16">
                  {DAYS.map((d) => (
                    <li key={d.day} data-day className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
                      <div>
                        <p data-num className="label label-volt mb-3">
                          {d.day}
                        </p>
                        <span className="mask-line">
                          <span data-copy className="display display-md block text-bone">
                            {d.line}
                          </span>
                        </span>
                      </div>
                      <p
                        data-note
                        className="max-w-xs font-mono text-[0.7rem] leading-[2] text-smoke lg:text-right"
                      >
                        {d.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
