"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { createPlateGeometry, createRimBandGeometry } from "./geometry";
import { useEquipmentMaterials, segmentsFor, type Detail } from "./useEquipmentMaterials";

type Props = {
  detail?: Detail;
  /** Hides the accent band — used for the quieter gallery pieces. */
  accent?: boolean;
} & React.ComponentProps<"group">;

/**
 * The hero object. Proportions are deliberately squat and wide-plated: a long
 * thin dumbbell reads as light, so the plates are oversized relative to the
 * handle and stacked in two tiers, which is what makes it look loaded.
 */
export default function Dumbbell({ detail = "high", accent = true, ...props }: Props) {
  const m = useEquipmentMaterials(detail);
  const seg = segmentsFor(detail);

  const geo = useMemo(() => {
    const outer = createPlateGeometry({
      radius: 0.56,
      halfThickness: 0.085,
      bore: 0.1,
      chamfer: 0.075,
      segments: seg,
    });
    const inner = createPlateGeometry({
      radius: 0.68,
      halfThickness: 0.1,
      bore: 0.1,
      chamfer: 0.085,
      segments: seg,
    });
    const band = createRimBandGeometry(0.685, 0.022, seg);
    const handle = new THREE.CylinderGeometry(0.079, 0.079, 1.66, seg / 2, 1, false);
    const collar = new THREE.CylinderGeometry(0.135, 0.115, 0.13, seg / 2, 1, false);
    const cap = new THREE.CylinderGeometry(0.1, 0.1, 0.035, seg / 2);
    return { outer, inner, band, handle, collar, cap };
  }, [seg]);

  useEffect(
    () => () => Object.values(geo).forEach((g) => g.dispose()),
    [geo],
  );

  // Plate stack mirrored on both ends of the bar.
  const ends = [1, -1];

  return (
    <group {...props}>
      {/* Handle runs along X so the object's long axis is horizontal at rest */}
      <mesh geometry={geo.handle} material={m.grip} rotation={[0, 0, Math.PI / 2]} />

      {ends.map((s) => (
        <group key={s} position={[s * 0.83, 0, 0]}>
          <mesh
            geometry={geo.collar}
            material={m.steel}
            rotation={[0, 0, Math.PI / 2]}
            position={[-s * 0.06, 0, 0]}
          />
          <mesh
            geometry={geo.inner}
            material={m.rubber}
            rotation={[0, 0, Math.PI / 2]}
            position={[s * 0.12, 0, 0]}
          />
          {accent && (
            <mesh
              geometry={geo.band}
              material={m.volt}
              rotation={[0, 0, Math.PI / 2]}
              position={[s * 0.12, 0, 0]}
            />
          )}
          <mesh
            geometry={geo.outer}
            material={m.cast}
            rotation={[0, 0, Math.PI / 2]}
            position={[s * 0.31, 0, 0]}
          />
          <mesh
            geometry={geo.cap}
            material={m.steel}
            rotation={[0, 0, Math.PI / 2]}
            position={[s * 0.41, 0, 0]}
          />
        </group>
      ))}
    </group>
  );
}
