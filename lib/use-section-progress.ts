"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import { scrollStore } from "@/lib/scroll-store";

/**
 * A framer MotionValue fed straight from the shared scroll store.
 *
 * Deliberately not framer's own `useScroll`: that would set up a second scroll
 * listener with its own measurement pass, and DOM animation could then drift a
 * frame out of step with the WebGL director. One source of truth, two consumers.
 *
 * @param mode `travel` = 0 when the section enters the viewport, 1 when it leaves.
 *             `pin`    = 0 when its top hits the viewport top, 1 when its bottom does.
 */
export function useSectionProgress(
  id: string,
  mode: "travel" | "pin" = "pin",
): MotionValue<number> {
  const mv = useMotionValue(0);

  useEffect(() => {
    const read = () =>
      mode === "pin" ? scrollStore.pinProgress(id) : scrollStore.sectionProgress(id);
    mv.set(read());
    return scrollStore.subscribe(() => {
      const next = read();
      if (Math.abs(next - mv.get()) > 0.0001) mv.set(next);
    });
  }, [id, mode, mv]);

  return mv;
}
