"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { formatInt } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A count-up that decelerates hard rather than easing linearly — numbers should
 * arrive the way a plate settles. Used on exactly four facility figures and
 * nowhere else; the brief is explicit that counters everywhere is a smell.
 */
export default function Counter({
  value,
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // quintic ease-out: 80% of the distance is covered in the first third
      const eased = 1 - Math.pow(1 - t, 5);
      setN(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref}>
      {value > 0 ? formatInt(n) : ""}
      {suffix}
    </span>
  );
}
