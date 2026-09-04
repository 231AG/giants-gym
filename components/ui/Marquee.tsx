"use client";

import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A CSS-only ticker. Duplicated content plus a translate keyframe — no JS on the
 * main thread, and it stops dead under reduced motion (continuous animation is
 * exactly what that setting exists to kill).
 */
export default function Marquee({
  items,
  speed = 38,
  className,
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-10">
          <span>{item}</span>
          <span aria-hidden className="text-volt">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  if (reduced) {
    return (
      <div className={cn("flex overflow-hidden", className)} aria-hidden>
        {row}
      </div>
    );
  }

  return (
    <div className={cn("flex overflow-hidden", className)} aria-hidden>
      <div
        className="flex will-change-transform"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {row}
        {row}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
