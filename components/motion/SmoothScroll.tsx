"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollStore } from "@/lib/scroll-store";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Owns the single RAF loop for the whole site.
 *
 * Lenis provides the weighted, slightly-lagging scroll that makes the storytelling
 * feel authored rather than jumpy — and it is the same lag that lets the 3D object
 * trail the page by a frame or two, which is most of the "mass" illusion.
 * With reduced motion on, Lenis is not started at all and we read native scroll.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    scrollStore.reducedMotion = reduced;

    const syncViewport = () => {
      scrollStore.vw = window.innerWidth;
      scrollStore.vh = window.innerHeight;
      scrollStore.lowPower =
        window.matchMedia("(pointer: coarse)").matches ||
        (navigator.hardwareConcurrency ?? 8) <= 4;
      scrollStore.remeasureAll();
    };
    syncViewport();

    const onPointer = (e: PointerEvent) => {
      scrollStore.pointerActive = true;
      scrollStore.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollStore.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      scrollStore.pointerActive = false;
      scrollStore.pointerX = 0;
      scrollStore.pointerY = 0;
    };

    let lenis: Lenis | null = null;
    let raf = 0;
    let last = 0;

    const commit = (y: number) => {
      scrollStore.velocity = y - scrollStore.y;
      scrollStore.y = y;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollStore.progress = y / max;
      scrollStore.emit();
    };

    if (!reduced) {
      lenis = new Lenis({
        // Long duration + a late-ending curve: the page keeps moving after you stop,
        // the same way a loaded bar does.
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        syncTouch: false,
      });
      lenis.on("scroll", ({ scroll }: { scroll: number }) => commit(scroll));
    } else {
      commit(window.scrollY);
    }

    const tick = (time: number) => {
      // Periodic re-measure catches lazy images and font swaps changing section
      // heights. `last` has to advance or this becomes a full layout read of
      // every section on every frame.
      if (time - last > 400) {
        last = time;
        scrollStore.remeasureAll();
      }
      lenis?.raf(time);
      if (reduced) commit(window.scrollY);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Anchor links have to be routed through Lenis, otherwise the native jump
    // desyncs the store from the transform and the 3D director snaps.
    const onAnchorClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href^='#']");
      if (!el) return;
      const id = el.getAttribute("href")!.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -8, duration: 1.4 });
      else target.scrollIntoView();
      history.replaceState(null, "", `#${id}`);
    };

    // Exposed for the screenshot harness so it can drive the real scroll path.
    (window as unknown as { __lenisScrollTo?: (y: number) => void }).__lenisScrollTo = (
      y: number,
    ) => {
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    };

    const onResize = () => syncViewport();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("click", onAnchorClick);
    if (reduced) window.addEventListener("scroll", () => commit(window.scrollY), { passive: true });

    // Late remeasure once fonts and images have settled the layout.
    const settle = window.setTimeout(syncViewport, 900);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("click", onAnchorClick);
      lenis?.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
