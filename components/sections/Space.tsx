"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { MaskLines, Reveal } from "@/components/motion/MaskReveal";
import Counter from "@/components/motion/Counter";
import Marquee from "@/components/ui/Marquee";
import { facility } from "@/data/membership";
import { contact } from "@/config/site";
import { useSectionProgress } from "@/lib/use-section-progress";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * THE SPACE — the physical room.
 *
 * Three stills at three different parallax rates, so the group separates in
 * depth as it crosses the viewport instead of sliding as one flat sheet. The
 * statistics are the only counters on the site: four numbers that actually mean
 * something to someone deciding whether to walk in.
 */
export default function Space() {
  const p = useSectionProgress("space", "travel");
  const reduced = usePrefersReducedMotion();

  const slow = useTransform(p, [0, 1], ["8%", "-8%"]);
  const mid = useTransform(p, [0, 1], ["18%", "-18%"]);
  const fast = useTransform(p, [0, 1], ["30%", "-26%"]);
  const strip = useTransform(p, [0, 1], ["4%", "-12%"]);

  const s = (mv: unknown) => (reduced ? undefined : (mv as never));

  return (
    <Section id="space" className="relative z-10 overflow-hidden bg-void py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="03" className="mb-8">
          THE SPACE
        </SectionLabel>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MaskLines
            lines={["THE ROOM", "DOES HALF", "THE WORK."]}
            className="display display-md text-bone"
          />
          <Reveal delay={0.12} className="max-w-sm">
            <p className="text-sm leading-relaxed text-ash">
              Eighteen thousand square feet of platform, rig and open floor. Cast iron,
              calibrated plates, and enough of everything that you never queue for a
              bar. Chalk is allowed.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Parallax group ------------------------------------------------------ */}
      <div className="shell mt-16 grid grid-cols-12 gap-3 sm:gap-5 lg:mt-24">
        <motion.figure
          className="relative col-span-7 aspect-[4/5] overflow-hidden lg:col-span-5"
          style={{ y: s(slow) }}
        >
          <Image
            src="/media/space-tall-01.png"
            alt="Cast kettlebell on the training floor"
            fill
            sizes="(min-width: 1024px) 40vw, 60vw"
            className="scale-105 object-cover"
          />
        </motion.figure>

        <motion.figure
          className="relative col-span-5 mt-16 aspect-square overflow-hidden lg:col-span-4 lg:mt-32"
          style={{ y: s(fast) }}
        >
          <Image
            src="/media/space-wide-02.png"
            alt="Competition plate detail"
            fill
            sizes="(min-width: 1024px) 33vw, 40vw"
            className="scale-105 object-cover"
          />
        </motion.figure>

        <motion.figure
          className="relative col-span-12 mt-6 aspect-[16/9] overflow-hidden lg:col-span-3 lg:mt-56 lg:aspect-[3/4]"
          style={{ y: s(mid) }}
        >
          <Image
            src="/media/space-wide-01.png"
            alt="Loaded olympic bar racked on the platform"
            fill
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="scale-105 object-cover"
          />
        </motion.figure>
      </div>

      {/* Ticker -------------------------------------------------------------- */}
      <motion.div
        className="mt-24 border-y border-rule/60 py-5 lg:mt-36"
        style={{ x: s(strip) }}
      >
        <Marquee
          className="display text-[clamp(1.75rem,4.5vw,3.5rem)] leading-none text-iron"
          items={["CHALK ALLOWED", "24/7 ACCESS", "NO MIRRORS SELFIES", "CALIBRATED PLATES", "OPEN PLATFORM"]}
        />
      </motion.div>

      {/* Facility figures ---------------------------------------------------- */}
      <div className="shell mt-20 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {facility.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.07}>
            <p className="label mb-3">{f.label}</p>
            <p className="display display-sm text-bone">
              {f.animate ? <Counter value={f.value} suffix={f.suffix} /> : f.suffix}
            </p>
          </Reveal>
        ))}
      </div>

      <div className="shell mt-20 border-t border-rule pt-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <div>
            <p className="label mb-4">OPENING</p>
            <dl className="space-y-2">
              {contact.hours.map((h) => (
                <div key={h.days} className="flex gap-6 font-mono text-xs">
                  <dt className="w-24 text-smoke">{h.days}</dt>
                  <dd className="text-bone">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="label mb-4">FIND US</p>
            <p className="font-mono text-xs leading-relaxed text-bone">
              {contact.address}
              <br />
              <a href={contact.phoneHref} className="hover:text-volt">
                {contact.phone}
              </a>
              <br />
              <a href={contact.emailHref} className="hover:text-volt">
                {contact.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
