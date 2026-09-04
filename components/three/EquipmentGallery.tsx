"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import Dumbbell from "./Dumbbell";
import Barbell from "./Barbell";
import Kettlebell from "./Kettlebell";
import WeightPlate from "./WeightPlate";
import StudioEnvironment from "./StudioEnvironment";
import { HeavySpring } from "@/lib/motion-physics";
import { clamp } from "@/lib/utils";
import type { Piece } from "@/data/equipment";
import type { Detail } from "./useEquipmentMaterials";

const PIECES = {
  dumbbell: { C: Dumbbell, scale: 1.05, y: 0 },
  barbell: { C: Barbell, scale: 0.62, y: 0 },
  kettlebell: { C: Kettlebell, scale: 1.5, y: -0.1 },
  plate: { C: WeightPlate, scale: 1.0, y: 0 },
} as const;

/**
 * Inspect rig.
 *
 * Drag is integrated as angular *momentum*, not as a direct mapping: a flick
 * spins the piece and it coasts down against friction, exactly as a plate
 * spinning on a sleeve does. Vertical drag is clamped and sprung back toward
 * level, so you can look over or under the piece but never lose it — the brief
 * asks for an inspection tool, not a toy with a physics sandbox.
 */
function Rig({
  id,
  detail,
  reduced,
}: {
  id: Piece["id"];
  detail: Detail;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const entry = PIECES[id];
  const Component = entry.C;

  const state = useRef({
    yaw: -0.6,
    yawVel: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
  const pitch = useRef(new HeavySpring(0.16, 60, 15, 1.4));
  const pitchTarget = useRef(0.16);
  const enter = useRef(new HeavySpring(0, 70, 17, 1.3));

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (reduced) return;
    state.current.dragging = true;
    state.current.lastX = e.clientX;
    state.current.lastY = e.clientY;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    state.current.dragging = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const s = state.current;
    if (!s.dragging || reduced) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    // Drag adds velocity rather than setting rotation, which is what gives the
    // release its coast instead of a dead stop.
    s.yawVel += dx * 0.00042;
    pitchTarget.current = clamp(pitchTarget.current - dy * 0.004, -0.55, 0.62);
  };

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const g = group.current;
    if (!g) return;
    const s = state.current;

    if (reduced) {
      g.rotation.set(0.16, -0.6, 0);
      g.scale.setScalar(entry.scale);
      return;
    }

    // Idle drift keeps the piece alive; friction is frame-rate independent.
    if (!s.dragging) s.yawVel += 0.00022;
    s.yawVel *= Math.pow(0.945, dt * 60);
    s.yaw += s.yawVel * 60 * dt;

    pitch.current.update(pitchTarget.current, dt);
    enter.current.update(1, dt);

    g.rotation.set(pitch.current.value, s.yaw, 0);
    g.position.y = entry.y;
    g.scale.setScalar(entry.scale * enter.current.value);
  });

  return (
    <group
      ref={group}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerMove={onMove}
    >
      {/* Invisible grab volume — dragging the thin handle of a barbell would
          otherwise be a test of aim rather than an inspection. */}
      <mesh visible={false}>
        <sphereGeometry args={[1.6, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <Component detail={detail} />
    </group>
  );
}

export default function EquipmentGallery({
  id,
  detail = "high",
  reduced = false,
}: {
  id: Piece["id"];
  detail?: Detail;
  reduced?: boolean;
}) {
  const [ready, setReady] = useState(false);

  return (
    <Canvas
      dpr={[1, detail === "high" ? 1.6 : 1.25]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: detail === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 34, position: [0, 0, 5.4] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        setReady(true);
      }}
      style={{ touchAction: "pan-y", cursor: reduced ? "default" : "grab" }}
    >
      <Suspense fallback={null}>
        <StudioEnvironment detail={detail} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <directionalLight position={[-4, -1, -3]} intensity={0.9} color="#9fb4ff" />
        <pointLight position={[3, -1.5, -3]} intensity={10} distance={12} color="#d7ff3e" />
        <ambientLight intensity={0.18} />
        {ready && <Rig id={id} detail={detail} reduced={reduced} />}
      </Suspense>
    </Canvas>
  );
}
