"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { createPlateGeometry, createRimBandGeometry } from "./geometry";
import { useEquipmentMaterials, segmentsFor, type Detail } from "./useEquipmentMaterials";

type Props = { detail?: Detail; accent?: boolean } & React.ComponentProps<"group">;

/** A single competition plate, standing on edge with three grip cut-outs. */
export default function WeightPlate({ detail = "high", accent = true, ...props }: Props) {
  const m = useEquipmentMaterials(detail);
  const seg = segmentsFor(detail);

  const geo = useMemo(() => {
    const plate = createPlateGeometry({
      radius: 1.05,
      halfThickness: 0.085,
      bore: 0.13,
      chamfer: 0.09,
      segments: seg,
    });
    const band = createRimBandGeometry(1.056, 0.024, seg);
    const bore = new THREE.CylinderGeometry(0.135, 0.135, 0.18, seg / 2, 1, true);
    const grip = new THREE.TorusGeometry(0.12, 0.028, 8, 20);
    return { plate, band, bore, grip };
  }, [seg]);

  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  return (
    <group {...props}>
      <mesh geometry={geo.plate} material={m.rubber} rotation={[Math.PI / 2, 0, 0]} />
      {accent && (
        <mesh geometry={geo.band} material={m.volt} rotation={[Math.PI / 2, 0, 0]} />
      )}
      <mesh geometry={geo.bore} material={m.steel} rotation={[Math.PI / 2, 0, 0]} />
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        return (
          <mesh
            key={i}
            geometry={geo.grip}
            material={m.steel}
            position={[Math.cos(a) * 0.58, Math.sin(a) * 0.58, 0]}
          />
        );
      })}
    </group>
  );
}
