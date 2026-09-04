"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { MaskLines, Reveal } from "@/components/motion/MaskReveal";
import Cta from "@/components/ui/Cta";
import { programs } from "@/data/programs";
import { cta } from "@/config/site";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion, useLowPower } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const MEDIA: Record<string, string> = {
  strength: "/media/program-strength.png",
  mass: "/media/program-mass.png",
  cardio: "/media/program-cardio.png",
  functional: "/media/program-functional.png",
  personal: "/media/program-personal.png",
};

/**
 * TRAINING — one editorial index, not five cards.
 *
 * The programmes are a single ranged list of display-scale names. Whichever one
 * holds attention takes the accent, shifts right and pulls its detail panel into
 * frame; every other name drops to a quiet outline weight. The interaction is
 * the layout — there is no card, border or shadow anywhere in it.
 *
 * Desktop drives it from hover *and* focus, so a keyboard tab produces exactly
 * the same result as a pointer. Coarse-pointer devices get a different component
 * shape entirely (an accordion) rather than a hover state nobody can reach.
 */
export default function TrainingSection() {
  const [active, setActive] = useState(programs[0].id);
  const [openMobile, setOpenMobile] = useState<string | null>(programs[0].id);
  const reduced = usePrefersReducedMotion();
  const touch = useLowPower();

  const current = programs.find((p) => p.id === active) ?? programs[0];
  const select = useCallback((id: string) => setActive(id), []);

  return (
    <Section id="training" className="relative z-10 overflow-hidden bg-void py-24 sm:py-32">
      {/* Background media — the same still as the detail panel, pushed almost to
          black. It changes with the selection, which is what makes the whole
          screen respond rather than just the row under the cursor. */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current.id}
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.28, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: reduced ? 0 : 1.1, ease: EASE.heavy }}
        >
          <Image
            src={MEDIA[current.id]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right"
            style={{ maskImage: "linear-gradient(to left, #000 5%, transparent 62%)" }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="shell relative">
        <SectionLabel index="02" className="mb-8">
          TRAINING
        </SectionLabel>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <MaskLines
            lines={["FIVE WAYS", "TO GET STRONGER."]}
            className="display display-md max-w-[16ch] text-bone"
          />
          <Reveal delay={0.15}>
            <p className="max-w-sm text-sm leading-relaxed text-ash">
              Every programme runs on the same floor, with the same coaches. Pick the
              one that matches what you are actually training for.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          {/* ---------------------------------------------------------------- */}
          {/* The index                                                         */}
          {/* ---------------------------------------------------------------- */}
          <ul className="relative -mx-2">
            {programs.map((program, i) => {
              const isActive = program.id === active;
              const isOpen = openMobile === program.id;
              return (
                <li key={program.id} className="border-b border-rule/60 first:border-t">
                  <button
                    type="button"
                    onMouseEnter={() => !touch && select(program.id)}
                    onFocus={() => !touch && select(program.id)}
                    onClick={() => {
                      select(program.id);
                      setOpenMobile((cur) => (cur === program.id ? null : program.id));
                    }}
                    aria-expanded={touch ? isOpen : undefined}
                    aria-controls={`program-${program.id}`}
                    className="group flex w-full items-center gap-4 px-2 py-5 text-left sm:gap-7 sm:py-7"
                  >
                    <span
                      className={cn(
                        "label shrink-0 transition-colors duration-[--duration-ui]",
                        isActive ? "label-volt" : "text-smoke",
                      )}
                    >
                      {program.index}
                    </span>

                    <motion.span
                      className="display display-sm block flex-1 leading-none"
                      animate={
                        reduced
                          ? undefined
                          : {
                              // The quiet state is a real drop in weight and
                              // presence, not a 10% opacity nudge — the contrast
                              // between chosen and unchosen has to carry the layout.
                              x: isActive ? 14 : 0,
                              color: isActive ? "#edede8" : "#4c5157",
                            }
                      }
                      transition={{ duration: 0.42, ease: EASE.heavy }}
                    >
                      {program.title}
                    </motion.span>

                    <span
                      className={cn(
                        "label hidden shrink-0 transition-opacity duration-[--duration-ui] sm:block",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {program.discipline}
                    </span>

                    <span
                      aria-hidden
                      className={cn(
                        "shrink-0 text-lg transition-all duration-[--duration-ui] ease-[--ease-heavy]",
                        isActive ? "translate-x-0 text-volt" : "-translate-x-2 text-transparent",
                        touch && (isOpen ? "rotate-90" : "rotate-0"),
                      )}
                    >
                      →
                    </span>
                  </button>

                  {/* Touch: the detail belongs inline, under the thing tapped. */}
                  <AnimatePresence initial={false}>
                    {touch && isOpen && (
                      <motion.div
                        id={`program-${program.id}`}
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.5, ease: EASE.heavy }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="px-2 pb-8">
                          <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden">
                            <Image
                              src={MEDIA[program.id]}
                              alt={`${program.title} equipment`}
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm leading-relaxed text-ash">
                            {program.description}
                          </p>
                          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                            {program.meta.map((m) => (
                              <div key={m.label}>
                                <dt className="label">{m.label}</dt>
                                <dd className="mt-1 font-mono text-xs text-bone">{m.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}

            <li className="pt-10">
              <Cta href={cta.primary.href}>START A PROGRAMME</Cta>
            </li>
          </ul>

          {/* ---------------------------------------------------------------- */}
          {/* The detail panel — desktop only; touch gets the accordion above.   */}
          {/* ---------------------------------------------------------------- */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-pitch">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0 0 100% 0)", scale: 1.08 }}
                    animate={{ clipPath: "inset(0 0 0% 0)", scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.72, ease: EASE.heavy }}
                  >
                    <Image
                      src={MEDIA[current.id]}
                      alt={`${current.title} equipment`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <span className="label absolute left-4 top-4 z-10 bg-void/70 px-2 py-1">
                  {current.index} / {current.title}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: EASE.heavy }}
                  className="mt-7"
                >
                  <p className="body-lg max-w-md text-sm">{current.description}</p>
                  <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-rule pt-6">
                    {current.meta.map((m) => (
                      <div key={m.label}>
                        <dt className="label">{m.label}</dt>
                        <dd className="mt-1.5 font-mono text-xs text-bone">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
