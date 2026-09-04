"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { getKnurlNormal } from "./textures";

export type Detail = "high" | "low";

/**
 * One shared material set for every piece of equipment.
 *
 * Palette discipline carries into 3D: plates are near-black rubber, hardware is
 * raw steel, and the only saturated surface in the entire scene is the lime rim
 * band — which is emissive, so it reads as energy rather than paint.
 */
export function useEquipmentMaterials(detail: Detail = "high") {
  const materials = useMemo(() => {
    const knurl = typeof document !== "undefined" ? getKnurlNormal() : null;

    const steel = new THREE.MeshStandardMaterial({
      color: "#8e959c",
      metalness: 1,
      roughness: 0.29,
      envMapIntensity: 1.35,
    });

    const grip = new THREE.MeshStandardMaterial({
      color: "#767d85",
      metalness: 1,
      roughness: 0.44,
      envMapIntensity: 1.1,
    });
    if (knurl && detail === "high") {
      grip.normalMap = knurl;
      grip.normalScale = new THREE.Vector2(0.55, 0.55);
    }

    const rubber = new THREE.MeshStandardMaterial({
      color: "#111316",
      metalness: 0.08,
      roughness: 0.68,
      envMapIntensity: 0.85,
    });

    const cast = new THREE.MeshStandardMaterial({
      color: "#1a1d21",
      metalness: 0.55,
      roughness: 0.52,
      envMapIntensity: 1.0,
    });

    const volt = new THREE.MeshStandardMaterial({
      color: "#c6ef2c",
      emissive: "#a9cc25",
      emissiveIntensity: 0.55,
      metalness: 0.2,
      roughness: 0.42,
    });

    return { steel, grip, rubber, cast, volt };
  }, [detail]);

  useEffect(
    () => () => Object.values(materials).forEach((m) => m.dispose()),
    [materials],
  );

  return materials;
}

export const segmentsFor = (detail: Detail) => (detail === "high" ? 64 : 28);
