"use client";

import { motion } from "framer-motion";
import Section from "@/components/motion/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import { MaskLines, Reveal } from "@/components/motion/MaskReveal";
import Cta from "@/components/ui/Cta";
import { plans } from "@/data/membership";
import { EASE } from "@/lib/motion-physics";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * MEMBERSHIP.
 *
 * Three columns divided by hairlines rather than three boxes — the rule is that
 * nothing on this site is a card. The committed plan is marked by a lime keyline
 * on one edge and a raised price, which is enough; a "MOST POPULAR" ribbon would
 * undo the whole art direction.
 *
 * No payment is implemented. Every CTA resolves through `config/site.ts`, so the
 * destination can be a booking system, a WhatsApp thread or a phone number.
 */
export default function MembershipSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <Section id="membership" className="relative z-10 bg-void py-24 sm:py-32">
      <div className="shell">
        <SectionLabel index="06" className="mb-8">
          MEMBERSHIP
        </SectionLabel>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <MaskLines
            lines={["CHOOSE", "YOUR COMMITMENT."]}
            className="display display-md text-bone"
          />
          <Reveal delay={0.12} className="max-w-sm">
            <p className="text-sm leading-relaxed text-ash">
              No joining fee, no minimum term you didn&apos;t agree to, no freeze
              charges. Prices shown per month, including tax.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid border-t border-rule lg:mt-24 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.article
              key={plan.id}
              initial={reduced ? undefined : { opacity: 0, y: 30 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: EASE.heavy, delay: i * 0.09 }}
              className={cn(
                "relative flex flex-col gap-8 border-b border-rule px-0 py-10 lg:border-b-0 lg:px-8 lg:py-12",
                i > 0 && "lg:border-l lg:border-rule",
                i === 0 && "lg:pl-0",
                plan.featured && "lg:bg-pitch",
              )}
            >
              {plan.featured && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-volt lg:inset-y-0 lg:right-auto lg:h-auto lg:w-px"
                />
              )}

              <header>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="display display-sm leading-none text-bone">{plan.name}</h3>
                  {plan.featured && <span className="label label-volt">COMMITTED</span>}
                </div>
                <p className="label">{plan.commitment}</p>
              </header>

              <p className="flex items-baseline gap-2">
                <span className="font-mono text-sm text-smoke">£</span>
                <span
                  className={cn(
                    "display leading-none",
                    plan.featured ? "text-[4.5rem] text-volt" : "text-[3.5rem] text-bone",
                  )}
                >
                  {plan.price}
                </span>
                <span className="label">{plan.cadence}</span>
              </p>

              <p className="text-sm leading-relaxed text-ash">{plan.summary}</p>

              <ul className="flex-1 space-y-3 border-t border-rule/60 pt-6">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ash">
                    <span aria-hidden className="mt-[0.55em] block h-px w-3 shrink-0 bg-volt" />
                    {item}
                  </li>
                ))}
              </ul>

              <Cta
                href={plan.href}
                variant={plan.featured ? "solid" : "ghost"}
                className="w-full"
              >
                {plan.ctaLabel}
              </Cta>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
