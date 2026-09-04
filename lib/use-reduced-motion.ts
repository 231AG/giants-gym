"use client";

import { useEffect, useState } from "react";

/**
 * Reduced-motion, resolved on the client only. Defaults to `false` on the server
 * so the markup matches, then corrects on mount before any animation is scheduled.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** True on coarse-pointer / low-core devices — used to shed 3D detail. */
export function useLowPower() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    setLow(
      window.matchMedia("(pointer: coarse)").matches ||
        (navigator.hardwareConcurrency ?? 8) <= 4,
    );
  }, []);
  return low;
}
