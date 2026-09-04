"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Dumbbell from "./Dumbbell";
import { scrollStore } from "@/lib/scroll-store";
import { HeavySpring, ImpactShake } from "@/lib/motion-physics";
import { clamp, damp, lerp, mapRange, smoothstep } from "@/lib/utils";
import type { Detail } from "./useEquipmentMaterials";

/**
 * ---------------------------------------------------------------------------
 * THE DIRECTOR
 * ---------------------------------------------------------------------------
 * One dumbbell, one camera, four acts, no cuts. Every act reads its own progress
 * straight out of the scroll store, so the object's position is a pure function
 * of where the page is — but it never *jumps* there, because every channel is
 * routed through a HeavySpring. That gap between "where the scroll says it should
 * be" and "where its momentum has actually carried it" is the entire illusion of
 * mass, and it is why this is springs rather than a GSAP timeline.
 *
 *   ACT 1  HERO      object enters from the right, idles, answers the pointer
 *   ACT 2  STRENGTH  travels left across the page, rotating toward vertical
 *   ACT 3  FORGE     spins its plate face to camera; camera dollies in until the
 *                    plate fills the frame and wipes into the Training section
 *   ACT 4  RHYTHM    returns and slams through SQUAT / PRESS / LIFT / PUSH
 */

const REST = {
  camZ: 7.2,
  camY: 0,
};

export default function Stage({ detail = "high" }: { detail?: Detail }) {
  const group = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  // One spring per animated channel. Stiffness/damping are tuned per channel:
  // position is the heaviest, rotation carries the most overshoot, scale is
  // nearly critically damped because a wobbling *size* reads as rubber.
  const s = useMemo(
    () => ({
      px: new HeavySpring(2.4, 46, 13, 1.9),
      py: new HeavySpring(0, 46, 13, 1.9),
      pz: new HeavySpring(0, 60, 15, 1.6),
      rx: new HeavySpring(0, 52, 12.5, 1.5),
      ry: new HeavySpring(-1.4, 44, 11, 1.7),
      rz: new HeavySpring(0.1, 40, 10.5, 1.8),
      sc: new HeavySpring(1, 90, 19, 1.2),
      camZ: new HeavySpring(REST.camZ, 55, 15, 1.5),
      camY: new HeavySpring(REST.camY, 55, 15, 1.5),
      lean: new HeavySpring(0, 30, 9, 2.2),
    }),
    [],
  );

  const shake = useMemo(() => ({ y: new ImpactShake(), z: new ImpactShake() }), []);
  const lastBeat = useRef(-1);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const st = scrollStore;
    const g = group.current;
    if (!g) return;

    const vh = st.vh || 1;
    const heroP = clamp(st.y / vh);

    // The camera's fov is vertical, so a portrait viewport shows the same height
    // but far less width — an object parked at x=1.95 simply leaves the screen.
    // `wide` blends every horizontal target between a phone framing (object
    // centred, smaller, lifted above the copy) and the desktop framing.
    const aspect = st.vw / vh;
    const wide = clamp(mapRange(aspect, 0.72, 1.5, 0, 1));
    const a2 = st.has("strength") ? st.pinProgress("strength") : 0;
    const a3 = st.has("forge") ? st.pinProgress("forge") : 0;
    const a4 = st.has("rhythm") ? st.pinProgress("rhythm") : 0;
    const inRhythm = a4 > 0.001 && a4 < 0.999;

    // --- Reduced motion: one static, well-composed pose. No camera travel, no
    // idle, no pointer tracking, no scroll-driven rotation. -------------------
    if (st.reducedMotion) {
      const w = clamp(mapRange(st.vw / vh, 0.72, 1.5, 0, 1));
      g.position.set(lerp(0.05, 1.9, w), lerp(0.9, -0.15, w), 0);
      g.rotation.set(0.12, -1.15, 0.18);
      g.scale.setScalar(lerp(0.66, 1, w));
      camera.position.set(0, 0, REST.camZ);
      camera.lookAt(0, 0, 0);
      return;
    }

    // --- Target pose ---------------------------------------------------------
    let tx: number, ty: number, tz: number;
    let trx: number, try_: number, trz: number;
    let tsc: number, tCamZ: number, tCamY: number;

    if (inRhythm) {
      // ACT 4 — four beats, each one a hard arrival rather than a glide.
      const beat = Math.min(3, Math.floor(a4 * 4));
      const within = a4 * 4 - beat;
      if (beat !== lastBeat.current) {
        lastBeat.current = beat;
        // Energy arrives as velocity, then rings out. Amplitudes are small on
        // purpose — the brief asks for impact, not a camera earthquake.
        s.py.impulse(beat % 2 === 0 ? -7.5 : 7.5);
        s.rz.impulse(beat % 2 === 0 ? 5.5 : -5.5);
        shake.y.fire(0.045, 30, 11);
        shake.z.fire(0.03, 24, 10);
      }
      const poses = [
        { x: 0, y: -0.5, rz: Math.PI / 2, ry: -1.3, sc: 1.12 }, // SQUAT — sits low, vertical
        { x: 0, y: 0.62, rz: 0, ry: -1.7, sc: 1.06 }, //           PRESS — driven overhead
        { x: -0.35, y: -0.1, rz: 0.42, ry: -2.3, sc: 1.16 }, //     LIFT  — angled off the floor
        { x: 0.35, y: 0.12, rz: -0.3, ry: -3.1, sc: 1.1 }, //       PUSH  — thrown forward
      ];
      const p = poses[beat];
      tx = p.x * wide;
      ty = p.y;
      tz = 0.3 - within * 0.15;
      trx = 0.06;
      try_ = p.ry;
      trz = p.rz;
      tsc = p.sc * lerp(0.68, 1, wide);
      tCamZ = 6.1;
      tCamY = 0;
    } else {
      lastBeat.current = -1;

      // ACT 1 → 2 → 3, expressed as one continuous path.
      const enter = smoothstep(0, 1, clamp(st.introProgress));

      // ACT 1 HERO: enters from off-screen right, settles right-of-centre.
      const h = smoothstep(0, 1, heroP);
      const heroRestX = lerp(0.05, 1.95, wide);
      const heroRestY = lerp(0.95, -0.12, wide);
      let x = mapRange(enter, 0, 1, lerp(3.2, 5.6, wide), heroRestX) + h * -0.35 * wide;
      let y = heroRestY - h * 0.35 + (1 - enter) * 0.5;
      let z = 0;
      let rx = 0.08 + h * 0.05;
      let ry = -1.15 - enter * 0.25 - h * 0.5;
      let rz = 0.16 + h * 0.22;
      let sc = lerp(0.62, 0.86, wide) + enter * 0.14 * wide;
      let camZ = REST.camZ - h * 0.5;
      let camY = h * 0.18;

      // ACT 2 STRENGTH: crosses the page to camera-left and stands up.
      if (a2 > 0) {
        const e = smoothstep(0, 1, a2);
        x = mapRange(e, 0, 1, x, lerp(-0.15, -1.75, wide));
        y = mapRange(e, 0, 1, y, lerp(0.85, 0.15, wide));
        rz = mapRange(e, 0, 1, rz, 1.34);
        ry = mapRange(e, 0, 1, ry, -2.15);
        rx = mapRange(e, 0, 1, rx, -0.1);
        sc = mapRange(e, 0, 1, sc, lerp(0.78, 1.18, wide));
        camZ = mapRange(e, 0, 1, camZ, 6.1);
        camY = mapRange(e, 0, 1, camY, -0.1);
      }

      // ACT 3 FORGE: the transition. The object rotates its plate face square to
      // camera while the camera dollies through it; by a3 ~0.9 the plate is the
      // whole frame, so the hand-off to the Training section is a wipe, not a cut.
      if (a3 > 0) {
        const e = smoothstep(0, 0.92, a3);
        const push = smoothstep(0.15, 1, a3);
        x = mapRange(e, 0, 1, x, 0);
        y = mapRange(e, 0, 1, y, 0);
        z = 0;
        // Euler order is XYZ, so Z is applied to the object first. Leaving rz at
        // π/2 would stand the bar on end and put its long axis along world Y —
        // after which the Y-rotation only spins it about itself and the camera
        // ends up staring down the handle. rz must return to 0 so that the
        // subsequent -π/2 about Y swings the object's +X (the plate axis)
        // round to +Z, square to the lens. The extra full turn is for the spin.
        rz = mapRange(e, 0, 1, rz, 0);
        ry = mapRange(e, 0, 1, ry, -Math.PI / 2 - Math.PI * 2);
        rx = mapRange(e, 0, 1, rx, 0);
        sc = mapRange(e, 0, 1, sc, lerp(1.1, 1.42, wide));
        // The near plate face sits at roughly z = 1.76 once scaled, so the
        // camera has to stop in front of it, not at the origin.
        camZ = mapRange(push, 0, 1, camZ, lerp(2.75, 2.45, wide));
        camY = mapRange(e, 0, 1, camY, 0);
      }

      tx = x;
      ty = y;
      tz = z;
      trx = rx;
      try_ = ry;
      trz = rz;
      tsc = sc;
      tCamZ = camZ;
      tCamY = camY;
    }

    // --- Idle life -----------------------------------------------------------
    // A slow breath plus a continuous drift, both at an amplitude you notice only
    // if you stare. Suppressed once the forge push starts so it can't fight the
    // transition, and scaled down while a beat is still ringing.
    const idleGate = (1 - smoothstep(0.05, 0.5, a3)) * (inRhythm ? 0.35 : 1);
    const t = performance.now() / 1000;
    const idleY = Math.sin(t * 0.42) * 0.055 * idleGate;
    const idleRz = Math.sin(t * 0.31 + 1.1) * 0.035 * idleGate;
    const idleRy = t * 0.055 * (1 - smoothstep(0, 0.35, a2)) * (inRhythm ? 0 : 1);

    // --- Pointer response ----------------------------------------------------
    // Deliberately under-tuned: the springs below are the softest in the rig, so
    // the object arrives at the cursor about a third of a second late and drifts
    // slightly past it. A 1:1 pointer follow is what makes 3D props feel like paper.
    const pointerGate = (1 - smoothstep(0.1, 0.55, a3)) * (inRhythm ? 0.3 : 1);
    const pxAim = st.pointerActive ? st.pointerX : 0;
    const pyAim = st.pointerActive ? st.pointerY : 0;

    // --- Scroll momentum lean ------------------------------------------------
    // Fast scrolling tips the object against the direction of travel, the way a
    // loaded bar lags behind the hand carrying it.
    s.lean.update(clamp(st.velocity * 0.012, -0.5, 0.5), dt);

    s.px.update(tx + pxAim * 0.16 * pointerGate, dt);
    s.py.update(ty + pyAim * 0.1 * pointerGate, dt);
    s.pz.update(tz, dt);
    s.rx.update(trx + pyAim * -0.15 * pointerGate + s.lean.value * 0.35, dt);
    s.ry.update(try_ + pxAim * 0.26 * pointerGate, dt);
    s.rz.update(trz - s.lean.value * 0.22, dt);
    s.sc.update(tsc, dt);
    s.camZ.update(tCamZ, dt);
    s.camY.update(tCamY, dt);

    g.position.set(
      s.px.value,
      s.py.value + idleY + shake.y.update(dt),
      s.pz.value + shake.z.update(dt),
    );
    g.rotation.set(s.rx.value, s.ry.value + idleRy, s.rz.value + idleRz);
    g.scale.setScalar(s.sc.value);

    camera.position.x = damp(camera.position.x, st.pointerX * 0.14, 2.2, dt);
    camera.position.y = s.camY.value;
    camera.position.z = s.camZ.value;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <Dumbbell detail={detail} />
    </group>
  );
}
