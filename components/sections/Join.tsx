"use client";

import Section from "@/components/motion/Section";
import { MaskLines, Reveal } from "@/components/motion/MaskReveal";
import Cta from "@/components/ui/Cta";
import { contact, social, site } from "@/config/site";

/**
 * JOIN — the last screen, and the only one that is purely an ask.
 *
 * Every route out of here is configurable in `config/site.ts`: WhatsApp, phone,
 * email. No form, because a form without a backend is a lie about what happens
 * when you press the button.
 */
export default function Join() {
  return (
    <Section id="join" className="relative z-10 overflow-hidden bg-void pt-24 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-lines opacity-30"
        // Without the fade the grid starts on a hard horizontal seam at the
        // section boundary, which reads as a rendering artefact.
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "radial-gradient(60% 100% at 50% 100%, rgba(215,255,62,0.09), transparent 70%)" }}
      />

      <div className="shell relative">
        <p className="label mb-10">
          07 <span className="text-volt">/</span> JOIN
        </p>

        <MaskLines
          lines={["STOP", "READING.", <span key="s" className="text-volt">START LIFTING.</span>]}
          className="display display-lg text-bone"
        />

        <Reveal delay={0.2} className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Cta href={contact.primary}>{`JOIN THE GYM`}</Cta>
          <Cta href={contact.whatsapp} variant="ghost">
            MESSAGE US
          </Cta>
          <a
            href={contact.phoneHref}
            className="inline-flex min-h-[3.5rem] items-center font-mono text-[0.7rem] uppercase tracking-[0.24em] text-ash transition-colors duration-[--duration-micro] hover:text-volt sm:ml-4"
          >
            {contact.phone}
          </a>
        </Reveal>

        <footer className="mt-24 border-t border-rule pb-10 pt-8 sm:mt-32">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="display display-sm leading-none text-bone">
                {site.shortName}
                <span className="text-volt">.</span>
              </p>
              <p className="label mt-4">{contact.address}</p>
            </div>

            <nav aria-label="Social" className="flex gap-8">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="label transition-colors duration-[--duration-micro] hover:text-volt"
                >
                  {s.label}
                </a>
              ))}
            </nav>

            <p className="label">
              © {new Date().getFullYear()} {site.name} — DEMONSTRATION PROJECT
            </p>
          </div>
        </footer>
      </div>
    </Section>
  );
}
