import * as THREE from "three";

/**
 * Procedural knurl normal map for the grip.
 *
 * Generated on the client into a 256px canvas rather than shipped as an image:
 * it costs a couple of milliseconds once, weighs nothing over the wire, and it
 * is the single detail that stops the handle reading as a plain grey tube.
 * Height field is a diamond cross-hatch; the normal is its analytic gradient.
 */
let knurlCache: THREE.Texture | null = null;

export function getKnurlNormal(size = 256, frequency = 26, depth = 1.9): THREE.Texture {
  if (knurlCache) return knurlCache;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const k = (frequency * Math.PI * 2) / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // h = sin(k(x+y)) * sin(k(x-y)) → a diamond lattice
      const a = k * (x + y);
      const b = k * (x - y);
      const dhdx = k * (Math.cos(a) * Math.sin(b) + Math.sin(a) * Math.cos(b));
      const dhdy = k * (Math.cos(a) * Math.sin(b) - Math.sin(a) * Math.cos(b));

      let nx = -dhdx * depth;
      let ny = -dhdy * depth;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;

      const i = (y * size + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz / len) * 0.5 * 255 + 127;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 1);
  tex.anisotropy = 4;
  knurlCache = tex;
  return tex;
}

export function disposeTextures() {
  knurlCache?.dispose();
  knurlCache = null;
}
