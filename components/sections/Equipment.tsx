"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { MaskLines } from "@/components/motion/MaskReveal";
import { equipment } from "@/data/equipment";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion, useLowPower } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * THE RACK — the second WebGL surface, and the only interactive one.
 *
 * It is a separate canvas from the hero director, mounted through an
 * IntersectionObserver and never before: two live contexts would otherwise both
 * be drawing for the whole length of the page. Because the hero canvas has
 * already stopped rendering by the time this section is reached, only one scene
 * is ever actually running.
 */
const Gallery = dynamic(() => import("@/components/three/EquipmentGallery"), {
  ssr: false,
  loading: () => null,
});

export default function Equipment() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const holder = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const lowPower = useLowPower();

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const piece = equipment[active];

  return (
    <Section id="equipment" className="relative z-10 bg-void py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="04" className="mb-8">
          THE RACK
        </SectionLabel>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MaskLines
            lines={["FOUR TOOLS.", "NOTHING", "DECORATIVE."]}
            className="display display-md text-bone"
          />
          <p className="label max-w-xs lg:text-right">
            {reduced ? "STATIC VIEW — REDUCED MOTION" : "DRAG TO INSPECT · FLICK TO SPIN"}
          </p>
        </div>

        <div
          ref={holder}
          className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16"
        >
          {/* Stage --------------------------------------------------------- */}
          <div className="relative aspect-square w-full overflow-hidden bg-pitch sm:aspect-[4/3] lg:aspect-square">
            <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
            {inView && (
              <Gallery
                id={piece.id}
                detail={lowPower ? "low" : "high"}
                reduced={reduced}
              />
            )}
            <span className="label absolute bottom-4 left-4 z-10">
              {String(active + 1).padStart(2, "0")} / {String(equipment.length).padStart(2, "0")}
            </span>
          </div>

          {/* Selector + detail --------------------------------------------- */}
          <div>
            <ul className="grid grid-cols-2 gap-px bg-rule/60 sm:grid-cols-4 lg:grid-cols-2">
              {equipment.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}
                    className={cn(
                      "flex min-h-[4.5rem] w-full items-center px-4 text-left font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors duration-[--duration-micro]",
                      i === active
                        ? "bg-volt text-black"
                        : "bg-void text-ash hover:bg-steel hover:text-bone",
                    )}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            <AnimatePresence mode="wait">
              <motion.div
                key={piece.id}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: EASE.heavy }}
                className="mt-10"
              >
                <p className="label mb-4">{piece.spec}</p>
                <h3 className="display display-sm mb-5 leading-none text-bone">
                  {piece.name}
                </h3>
                <p className="text-sm leading-relaxed text-ash">{piece.description}</p>
                <p className="label mt-7 border-t border-rule pt-5">
                  <span className="text-volt">USE </span>
                  {piece.purpose}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
