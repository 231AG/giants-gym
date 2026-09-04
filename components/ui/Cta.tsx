"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  onClick?: () => void;
};

/**
 * The site's only button.
 *
 * Solid = lime on black, and it is the single loudest element on any screen it
 * appears on — which is why there is never more than one per viewport. The hover
 * state is a wipe from the left rather than a colour change: a filled bar sliding
 * across reads as force. Everything here is a real <a>, so keyboard and screen
 * reader behaviour is the browser's, not ours.
 */
export default function Cta({ href, children, variant = "solid", className, onClick }: Props) {
  const solid = variant === "solid";
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden",
        // 56px min target — comfortably above the 44px floor on touch
        "min-h-[3.5rem] px-7 sm:px-9",
        "font-mono text-[0.7rem] font-medium uppercase tracking-[0.24em]",
        "transition-colors duration-[--duration-micro]",
        solid
          ? "bg-volt text-black hover:bg-bone"
          : "border border-rule text-bone hover:border-volt",
        className,
      )}
    >
      {!solid && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-volt transition-transform duration-[--duration-ui] ease-[--ease-heavy] group-hover:translate-x-0"
        />
      )}
      <span
        className={cn(
          "relative z-10 flex items-center gap-3",
          !solid && "transition-colors duration-[--duration-micro] group-hover:text-black",
        )}
      >
        {children}
        <span
          aria-hidden
          className="inline-block transition-transform duration-[--duration-ui] ease-[--ease-heavy] group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}
