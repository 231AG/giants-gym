"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import * as THREE from "three";
import Stage from "./Stage";
import StudioEnvironment from "./StudioEnvironment";
import { scrollStore } from "@/lib/scroll-store";
import { usePrefersReducedMotion, useLowPower } from "@/lib/use-reduced-motion";

/**
 * The persistent WebGL layer.
 *
 * It sits fixed behind the whole document at z-0; the sections that want to show
 * the object simply don't paint a background, and the ones that don't (Training,
 * The Gym, Membership) are opaque. That is what lets a single scene run the
 * length of the page without ever mounting or unmounting a second canvas.
 *
 * It stops rendering entirely — `frameloop="never"` — the moment no transparent
 * section is on screen, which is roughly half the page.
 */
export default function GiantsCanvas() {
  const reduced = usePrefersReducedMotion();
  const lowPower = useLowPower();
  const [active, setActive] = useState(true);
  const activeRef = useRef(true);

  useEffect(() => {
    // The object is on stage for hero → strength → forge, then again for rhythm.
    const evaluate = () => {
      const st = scrollStore;
      const vh = st.vh || 1;
      const inOpening = st.y < (st.has("forge") ? Infinity : vh * 4);
      const forgeDone = st.has("forge") ? st.pinProgress("forge") >= 0.999 : false;
      const rhythmP = st.has("rhythm") ? st.pinProgress("rhythm") : 0;
      const inRhythm = rhythmP > 0 && rhythmP < 1;
      const next = (inOpening && !forgeDone) || inRhythm;
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };
    evaluate();
    return scrollStore.subscribe(evaluate);
  }, []);

  const detail = lowPower ? "low" : "high";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: active ? 1 : 0, transition: "opacity 500ms var(--ease-heavy)" }}
    >
      <Canvas
        // Cap DPR: past ~1.75 the extra pixels are invisible on a dark scene and
        // cost 2× fill rate on the retina laptops this will mostly be seen on.
        dpr={[1, lowPower ? 1.35 : 1.75]}
        frameloop={active && !reduced ? "always" : reduced ? "demand" : "never"}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ fov: 35, position: [0, 0, 7.2], near: 0.1, far: 60 }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.02;
          scene.fog = new THREE.Fog("#050506", 9, 26);
        }}
      >
        <StudioEnvironment detail={detail} />

        {/* A crisp key on top of the baked environment: the environment gives the
            body of the light, this gives the hard specular edge on the steel. */}
        <directionalLight position={[3.5, 6, 4]} intensity={2.3} color="#ffffff" />
        <directionalLight position={[-5, -1, -3]} intensity={0.9} color="#9fb4ff" />
        <pointLight position={[4, -1.5, -3]} intensity={12} distance={14} color="#d7ff3e" />
        <ambientLight intensity={0.16} />

        <Stage detail={detail} />

        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
        <Preload all />
      </Canvas>
    </div>
  );
}
