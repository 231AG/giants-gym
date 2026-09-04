"use client";

import { useEffect, useRef } from "react";
import { scrollStore } from "@/lib/scroll-store";
import { cn } from "@/lib/utils";

/**
 * A section that publishes its own document bounds to the scroll store, so the
 * 3D director can ask "how far through Strength are we?" without ever touching
 * the DOM inside a frame loop.
 */
export default function Section({
  id,
  className,
  children,
  ...rest
}: { id: string } & React.ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanup = scrollStore.registerSection(id, el);
    const ro = new ResizeObserver(() => scrollStore.measure(id, el));
    ro.observe(el);
    return () => {
      ro.disconnect();
      cleanup();
    };
  }, [id]);

  return (
    <section ref={ref} id={id} className={cn("relative", className)} {...rest}>
      {children}
    </section>
  );
}
