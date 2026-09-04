"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { createBellGeometry } from "./geometry";
import { useEquipmentMaterials, segmentsFor, type Detail } from "./useEquipmentMaterials";

type Props = { detail?: Detail; accent?: boolean } & React.ComponentProps<"group">;

/** Cast bell with a torus handle — a single continuous piece, as it is in life. */
export default function Kettlebell({ detail = "high", accent = true, ...props }: Props) {
  const m = useEquipmentMaterials(detail);
  const seg = segmentsFor(detail);

  const geo = useMemo(() => {
    const bell = createBellGeometry(seg);
    const handle = new THREE.TorusGeometry(0.33, 0.062, Math.max(10, seg / 4), seg);
    const neck = new THREE.CylinderGeometry(0.14, 0.2, 0.16, seg / 2);
    const band = new THREE.TorusGeometry(0.44, 0.017, 8, seg);
    return { bell, handle, neck, band };
  }, [seg]);

  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  return (
    <group {...props}>
      <mesh geometry={geo.bell} material={m.cast} />
      <mesh geometry={geo.neck} material={m.cast} position={[0, 0.5, 0]} />
      {/* Handle arc: the torus is clipped by the bell body, reading as a bail */}
      <mesh geometry={geo.handle} material={m.steel} position={[0, 0.62, 0]} />
      {accent && (
        <mesh geometry={geo.band} material={m.volt} position={[0, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]} />
      )}
    </group>
  );
}
