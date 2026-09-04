"use client";

/**
 * Full-viewport film grain + vignette. Fixed and pointer-transparent so it sits
 * over both the DOM and the WebGL canvas, which is what stops the 3D layer
 * looking like a separate, cleaner image pasted onto the page.
 */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden grain"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)",
        mixBlendMode: "normal",
      }}
    />
  );
}
