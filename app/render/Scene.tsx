"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Dumbbell from "@/components/three/Dumbbell";
import Barbell from "@/components/three/Barbell";
import Kettlebell from "@/components/three/Kettlebell";
import WeightPlate from "@/components/three/WeightPlate";
import StudioEnvironment from "@/components/three/StudioEnvironment";

const PIECES = {
  dumbbell: { C: Dumbbell, scale: 1, y: 0 },
  barbell: { C: Barbell, scale: 0.52, y: 0 },
  kettlebell: { C: Kettlebell, scale: 1.35, y: -0.1 },
  plate: { C: WeightPlate, scale: 0.92, y: 0 },
} as const;

/** Poses are hand-picked three-quarter angles — nothing reads flatter than an
 *  orthographic side-on product shot, and this imagery has to look photographed. */
const POSES: [number, number, number][] = [
  [0.28, -0.72, 0.16],
  [-0.34, 0.62, -0.22],
  [0.12, -1.35, 0.62],
  [0.55, -0.4, -0.1],
];

export default function Scene({
  piece,
  pose,
  zoom,
}: {
  piece: string;
  pose: number;
  zoom: number;
}) {
  const entry = PIECES[piece as keyof typeof PIECES] ?? PIECES.dumbbell;
  const Piece = entry.C;
  const rot = POSES[pose % POSES.length];

  return (
    <Canvas
      dpr={2}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      camera={{ fov: 32, position: [0, 0, 6.2 / zoom] }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.background = new THREE.Color("#08090a");
      }}
    >
      <StudioEnvironment />
      <directionalLight position={[3.5, 6, 4]} intensity={2.6} />
      <directionalLight position={[-5, -1, -3]} intensity={1.1} color="#9fb4ff" />
      <pointLight position={[3.5, -1.5, -3]} intensity={16} distance={14} color="#d7ff3e" />
      <ambientLight intensity={0.2} />
      <group rotation={rot} position={[0, entry.y, 0]} scale={entry.scale}>
        <Piece detail="high" />
      </group>
    </Canvas>
  );
}
