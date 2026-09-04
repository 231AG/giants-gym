"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { MaskLines, Reveal } from "@/components/motion/MaskReveal";
import { trainers } from "@/data/trainers";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * THE GIANTS — the coaches.
 *
 * A ledger, not a set of profile cards: four rows, each a name at display scale
 * with its specialty and years set as data. The reveal on hover/focus is a single
 * horizontal rule that draws under the row plus a line of copy sliding out from
 * behind it — no photograph, because placeholder headshots are the fastest way to
 * make a real gym's site look fake.
 */
export default function Giants() {
  const [hover, setHover] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <Section id="giants" className="relative z-10 bg-void py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="04" className="mb-8">
          THE GIANTS
        </SectionLabel>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MaskLines
            lines={["COACHED BY", "PEOPLE WHO", "STILL TRAIN."]}
            className="display display-md text-bone"
          />
          <Reveal delay={0.12} className="max-w-sm">
            <p className="text-sm leading-relaxed text-ash">
              Four coaches on the floor, every session. They write the programmes, they
              watch the sets, and they will tell you when to stop.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 lg:mt-24">
          {trainers.map((t, i) => {
            const on = hover === t.id;
            return (
              <li key={t.id} className="border-b border-rule/60 first:border-t">
                <Link
                  href={t.href}
                  onMouseEnter={() => setHover(t.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(t.id)}
                  onBlur={() => setHover(null)}
                  className="group relative flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:gap-8"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-px origin-left bg-volt transition-transform duration-[--duration-ui] ease-[--ease-heavy]",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                  <span className="label w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <motion.span
                    className="display display-sm flex-1 leading-none"
                    animate={reduced ? undefined : { x: on ? 12 : 0, color: on ? "#d7ff3e" : "#edede8" }}
                    transition={{ duration: 0.4, ease: EASE.heavy }}
                  >
                    {t.name}
                  </motion.span>

                  <span className="flex shrink-0 items-baseline gap-6 sm:gap-10">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">
                      {t.specialty}
                    </span>
                    <span className="label hidden md:block">{t.years}</span>
                  </span>

                  <span className="mask-line hidden max-w-xs flex-1 lg:block">
                    <motion.span
                      className="block font-mono text-[0.7rem] leading-relaxed text-smoke"
                      animate={reduced ? undefined : { y: on ? "0%" : "110%", opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.45, ease: EASE.heavy }}
                    >
                      {t.line}
                    </motion.span>
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 text-lg transition-all duration-[--duration-ui] ease-[--ease-heavy]",
                      on ? "translate-x-0 text-volt" : "-translate-x-2 text-smoke",
                    )}
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Reveal delay={0.1} className="mt-8">
          <p className="label">
            CREDENTIALS ON REQUEST <span className="text-volt">/</span> COACH BIOS ARE
            PLACEHOLDER DATA
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
