"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * A studio lit entirely from procedural lightformers — no HDRI is fetched.
 *
 * `frames={1}` bakes the cube map once on mount: the lights never move, only the
 * object does, so re-rendering the environment every frame would be pure waste.
 * The rig is a hard top-key, a long cold strip from the left for the steel
 * specular, and a lime kicker behind-right that puts the accent into the metal
 * without ever painting a surface lime.
 */
export default function StudioEnvironment({ detail = "high" }: { detail?: "high" | "low" }) {
  const resolution = detail === "high" ? 256 : 128;

  return (
    <Environment frames={1} resolution={resolution} background={false}>
      {/* Top key — a hard rectangle directly above and slightly forward */}
      <Lightformer
        form="rect"
        intensity={4.2}
        color="#ffffff"
        position={[0, 5, 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[7, 4, 1]}
      />
      {/* Long cold strip, camera-left — draws the length of the handle */}
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#cfe4ff"
        position={[-6, 1, 2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[10, 2.2, 1]}
      />
      {/* Lime kicker behind-right — the accent, delivered as reflection only */}
      <Lightformer
        form="rect"
        intensity={2.1}
        color="#d7ff3e"
        position={[5, 0.5, -4]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[6, 3, 1]}
      />
      {/* Low fill so the underside doesn't go fully black and lose its form */}
      <Lightformer
        form="rect"
        intensity={0.65}
        color="#5c6470"
        position={[0, -4, 1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[8, 4, 1]}
      />
    </Environment>
  );
}
