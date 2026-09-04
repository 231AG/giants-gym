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
 * Kettlebell bell + handle.
 *
 * The profile is a spline through hand-placed control points rather than a
 * formula: a kettlebell's silhouette — heavy round base, sharp shoulder, pinched
 * neck — is the thing that identifies it, and an analytic curve smooth enough to
 * lathe cleanly is never quite the right shape.
 */
export function createBellGeometry(segments: number) {
  const control = [
    new THREE.Vector2(0.004, -0.6),
    new THREE.Vector2(0.3, -0.585),
    new THREE.Vector2(0.5, -0.5),
    new THREE.Vector2(0.6, -0.3),
    new THREE.Vector2(0.605, -0.05),
    new THREE.Vector2(0.52, 0.14),
    new THREE.Vector2(0.34, 0.27),
    new THREE.Vector2(0.205, 0.37),
    new THREE.Vector2(0.178, 0.47),
    new THREE.Vector2(0.178, 0.55),
    new THREE.Vector2(0.004, 0.555),
  ];
  // Resampling the spline is what removes the faceting on the shoulder — a
  // lathe is only ever as smooth as the profile you hand it.
  const pts = new THREE.SplineCurve(control).getPoints(
    segments >= 48 ? 72 : 34,
  );
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
