import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import Grain from "@/components/motion/Grain";

export const metadata: Metadata = { title: "404" };

/**
 * Lives at the root rather than inside the (site) group so it catches every
 * unmatched URL. It brings its own minimal chrome — the full site layout would
 * boot Lenis and the WebGL loader for a page that is one joke and a way out.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-25" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, rgba(215,255,62,0.07), transparent 70%)",
        }}
      />

      <header className="shell relative flex h-[4.75rem] items-center">
        <Link href="/" className="display text-[1.75rem] leading-none text-bone">
          {site.shortName}
          <span className="text-volt">.</span>
        </Link>
      </header>

      <main className="shell relative flex flex-1 flex-col justify-center py-16">
        <p className="display display-lg leading-none text-volt">404</p>

        <h1 className="display display-md mt-6 text-bone">
          YOU TOOK
          <br />
          THE WRONG SET.
        </h1>

        <p className="mt-8 max-w-md text-sm leading-relaxed text-ash">
          This page isn&apos;t on the programme. Rack it, reset, and go again.
        </p>

        <div className="mt-12">
          <Link
            href="/#training"
            className="group inline-flex min-h-[3.5rem] items-center gap-3 bg-volt px-9 font-mono text-[0.7rem] uppercase tracking-[0.24em] text-black"
          >
            BACK TO TRAINING
            <span
              aria-hidden
              className="inline-block transition-transform duration-[--duration-ui] ease-[--ease-heavy] group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </div>
      </main>

      <footer className="shell relative border-t border-rule py-6">
        <p className="label">
          ERROR 404 <span className="text-volt">/</span> {site.name}
        </p>
      </footer>

      <Grain />
    </div>
  );
}
