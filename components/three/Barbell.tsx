"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { createPlateGeometry, createRimBandGeometry } from "./geometry";
import { useEquipmentMaterials, segmentsFor, type Detail } from "./useEquipmentMaterials";

type Props = { detail?: Detail; accent?: boolean } & React.ComponentProps<"group">;

/** Loaded olympic bar — sleeves, collars and a three-plate stack per side. */
export default function Barbell({ detail = "high", accent = true, ...props }: Props) {
  const m = useEquipmentMaterials(detail);
  const seg = segmentsFor(detail);

  const geo = useMemo(() => {
    const shaft = new THREE.CylinderGeometry(0.048, 0.048, 3.4, seg / 2, 1, false);
    const sleeve = new THREE.CylinderGeometry(0.082, 0.082, 0.78, seg / 2, 1, false);
    const collar = new THREE.CylinderGeometry(0.115, 0.115, 0.09, seg / 2);
    const plate = createPlateGeometry({
      radius: 0.78,
      halfThickness: 0.062,
      bore: 0.084,
      chamfer: 0.07,
      segments: seg,
    });
    const band = createRimBandGeometry(0.785, 0.016, seg);
    return { shaft, sleeve, collar, plate, band };
  }, [seg]);

  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  return (
    <group {...props}>
      <mesh geometry={geo.shaft} material={m.grip} rotation={[0, 0, Math.PI / 2]} />
      {[1, -1].map((s) => (
        <group key={s} position={[s * 2.0, 0, 0]}>
          <mesh geometry={geo.sleeve} material={m.steel} rotation={[0, 0, Math.PI / 2]} />
          {[-0.28, -0.14, 0].map((x, i) => (
            <group key={x} position={[s * x, 0, 0]}>
              <mesh geometry={geo.plate} material={m.rubber} rotation={[0, 0, Math.PI / 2]} />
              {accent && i === 0 && (
                <mesh geometry={geo.band} material={m.volt} rotation={[0, 0, Math.PI / 2]} />
              )}
            </group>
          ))}
          <mesh
            geometry={geo.collar}
            material={m.steel}
            rotation={[0, 0, Math.PI / 2]}
            position={[s * 0.09, 0, 0]}
          />
        </group>
      ))}
    </group>
  );
}
