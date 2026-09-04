"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { nav, cta, site } from "@/config/site";
import { scrollStore } from "@/lib/scroll-store";
import { EASE } from "@/lib/motion-physics";
import { cn } from "@/lib/utils";

/**
 * Minimal bar: wordmark, three links, one CTA.
 *
 * The scrolled state is a restraint exercise — the bar loses 12px of height,
 * gains a hairline and a blur, and the wordmark tightens. Nothing slides, nothing
 * changes colour. It should register as "the page moved", not as an event.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const next = scrollStore.y > 60;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    update();
    return scrollStore.subscribe(update);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-[--duration-ui] ease-[--ease-heavy]",
          scrolled
            ? "border-b border-rule/70 bg-void/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "shell flex items-center justify-between transition-[height] duration-[--duration-ui] ease-[--ease-heavy]",
            scrolled ? "h-[3.75rem]" : "h-[4.75rem] sm:h-[5.5rem]",
          )}
        >
          <Link
            href="/"
            className="display leading-none tracking-[-0.01em] text-bone transition-all duration-[--duration-ui] ease-[--ease-heavy]"
            style={{ fontSize: scrolled ? "1.35rem" : "1.75rem" }}
          >
            {site.shortName}
            <span className="text-volt">.</span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash transition-colors duration-[--duration-micro] hover:text-bone"
              >
                {item.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-volt transition-transform duration-[--duration-ui] ease-[--ease-heavy] group-hover:scale-x-100"
                />
              </Link>
            ))}
            <Link
              href={cta.primary.href}
              className="border border-volt px-5 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-volt transition-colors duration-[--duration-micro] hover:bg-volt hover:text-black"
            >
              JOIN
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative -mr-2 flex h-12 w-12 items-center justify-center md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="flex w-6 flex-col gap-[5px]">
              <span
                className={cn(
                  "block h-[2px] w-full bg-bone transition-transform duration-[--duration-ui] ease-[--ease-heavy]",
                  open && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-[2px] w-full bg-bone transition-opacity duration-[--duration-micro]",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-[2px] w-full bg-bone transition-transform duration-[--duration-ui] ease-[--ease-heavy]",
                  open && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-void/97 px-6 pb-14 pt-28 backdrop-blur-md md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: EASE.heavy }}
          >
            <ul className="flex flex-col gap-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.6, ease: EASE.heavy }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display display-sm block border-b border-rule py-5 text-bone"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.34, duration: 0.6, ease: EASE.heavy }}
              className="mt-10"
            >
              <Link
                href={cta.primary.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[3.5rem] items-center justify-center bg-volt px-8 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-black"
              >
                {cta.primary.label}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
