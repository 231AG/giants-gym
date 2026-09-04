import * as THREE from "three";

/**
 * All equipment is authored here as lathe/primitive geometry rather than loaded
 * from a GLB. Three reasons: nothing to download (first paint of the 3D layer is
 * immediate), the silhouette can be tuned in code while iterating on screenshots,
 * and the segment counts can be dropped wholesale on low-power devices.
 */

type PlateOptions = {
  radius: number;
  halfThickness: number;
  bore: number;
  chamfer: number;
  segments: number;
};

/**
 * A bumper-plate profile revolved into a solid disc. The chamfered rim is what
 * catches the key light and gives the plate its cast-iron read — a plain
 * cylinder looks like a coin.
 */
export function createPlateGeometry({
  radius,
  halfThickness: t,
  bore,
  chamfer: c,
  segments,
}: PlateOptions) {
  const profile = [
    new THREE.Vector2(bore, -t),
    new THREE.Vector2(radius - c, -t),
    new THREE.Vector2(radius - c * 0.35, -t + c * 0.4),
    new THREE.Vector2(radius, -t + c),
    new THREE.Vector2(radius, t - c),
    new THREE.Vector2(radius - c * 0.35, t - c * 0.4),
    new THREE.Vector2(radius - c, t),
    new THREE.Vector2(bore, t),
    new THREE.Vector2(bore, -t),
  ];
  const geo = new THREE.LatheGeometry(profile, segments);
  geo.computeVertexNormals();
  return geo;
}

/** The thin accent band inset into the plate rim — the scene's only lime. */
export function createRimBandGeometry(
  radius: number,
  halfThickness: number,
  segments: number,
) {
  const t = halfThickness;
  const profile = [
    new THREE.Vector2(radius, -t),
    new THREE.Vector2(radius, t),
  ];
  return new THREE.LatheGeometry(profile, segments);
}

/**
 * Kettlebell bell + handle. The bell is a lathed teardrop so the mass sits low,
 * which is the whole visual point of a kettlebell.
 */
export function createBellGeometry(segments: number) {
  const pts: THREE.Vector2[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const v = i / steps;
    const y = -0.62 + v * 1.16;
    // radius profile: wide and round at the base, pinched into a neck at the top
    const r =
      0.6 * Math.sqrt(Math.max(0.0001, 1 - Math.pow(v * 1.02 - 0.28, 2) / 0.62)) *
      (1 - Math.pow(v, 3.4) * 0.62);
    pts.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  pts.push(new THREE.Vector2(0.001, 0.56));
  const geo = new THREE.LatheGeometry(pts, segments);
  geo.computeVertexNormals();
  return geo;
}

/** Cheap disposal helper so switching gallery items doesn't leak GPU memory. */
export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose();
  });
}
