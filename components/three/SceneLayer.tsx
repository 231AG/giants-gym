"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Gate for the WebGL bundle.
 *
 * Three, fiber and drei are ~250kB gzipped between them — none of it belongs in
 * the critical path of a page whose first frame is a black screen and a word.
 * The import is deferred until the browser is idle and the intro has had a beat,
 * so the hero's typography lands on time regardless of how long the scene takes.
 */
const GiantsCanvas = dynamic(() => import("./GiantsCanvas"), { ssr: false });

export default function SceneLayer() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = () => !cancelled && setReady(true);

    // WebGL support check — no canvas, no scene, and the DOM hero still works.
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;
    } catch {
      return;
    }

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(start, { timeout: 900 })
      : window.setTimeout(start, 260);

    return () => {
      cancelled = true;
      if (typeof id === "number") clearTimeout(id);
    };
  }, []);

  if (!ready) return null;
  return <GiantsCanvas />;
}
