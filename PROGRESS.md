# GIANTS GYM — Build Progress

> Living checkpoint file. Re-read this first on resume (Section 0.2 of the brief).

## Status
**Current step:** 5 — Scroll storytelling (Hero, Strength, Forge done; Training onward remaining)
**Next action:** Build `components/sections/Training.tsx` (Section 9 editorial hover/tap
interaction), then Space, Rhythm, Giants, Transformation, Membership, Join, Footer.

## Environment findings (Step 1)
- Empty repo, branch `claude/giants-gym-3d-fitness-ren9hb`, no commits.
- Node v22.22.2, npm 10.9.7. npm registry reachable.
- **Visual tooling:** Playwright 1.62.1 installed as devDep. Bundled browsers absent, but a
  pre-installed Chromium exists at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
  Verified **WebGL 2.0 works headless** with `--use-gl=angle --use-angle=swiftshader
  --enable-unsafe-swiftshader`. Screenshot harness lives in `scripts/shoot.mjs` and can scroll,
  move the pointer, tap and resize — so 3D/scroll iteration is done against real renders.
- **Skills:** `SearchSkills` for three.js / webgl / r3f / design-critique returned **zero results** —
  no 3D or design-taste skill exists in this environment. Falling back to own judgment +
  `artifact-design` fundamentals + real screenshot review. Reported in the final writeup.

## Decisions
- **Accent colour: ELECTRIC LIME `#D7FF3E`** (chosen over bold orange / deep red).
  Reasoning: on near-black it hits ~16:1 luminance contrast, so the accent can legally carry
  small UI, focus rings and body-scale text (AAA) — orange (~8:1) and deep red (~4:1) cannot,
  which would have forced a second accent and broken the single-accent rule. It also reads
  "high-visibility industrial / voltage" rather than the expected gym red-orange, and it is the
  furthest from any existing sports brand's palette.
- **Type:** `Anton` (condensed heavy display) + `Inter` (body/UI) + `JetBrains Mono` (industrial
  data labels). Anton's single heavy weight is a feature — poster-grade, not corporate.
- **3D assets are procedural** (lathe/cylinder geometry authored in code), not downloaded GLBs:
  zero asset payload, instant load, and full control over knurling/chamfer detail.
- **Lighting is a procedural `<Environment>` of drei `<Lightformer>`s** — no external HDRI fetch,
  so the scene works offline and adds nothing to network cost.
- **One persistent `<Canvas>`** fixed behind the DOM, driven by a global scroll director. This is
  what makes the Section 8 hero→training 3D transition continuous instead of a cut.

## Steps
- [x] 1. Inspect repository and initialise project
- [x] 2. Brand system
- [x] 3. Hero
- [x] 4. 3D interaction + motion physics
- [ ] 5. Scroll storytelling — Hero / Strength / Forge built and shot; rest pending
- [ ] 6. Training interaction
- [ ] 7. Gym experience
- [ ] 8. Membership
- [ ] 9. Responsive
- [ ] 10. Performance
- [ ] 11. Test + polish

## Fixes found by looking at real renders
1. `display-xl` at `17vw` clipped the top of the headline on 16:9 — every display
   size is now bounded on both axes via `min(vw, svh)`.
2. Hero reveal delays were hard-coded to follow the intro, so a returning visitor
   (curtain skipped) waited 2.9s for a CTA. Timeline offset now derives from
   `lib/intro-state.ts`, shared by the curtain and the hero.
3. **The forge transition was pointing the camera down the handle.** Euler order is
   XYZ, so `rz = π/2` stood the bar on end and put its long axis along world Y —
   the following Y-rotation then only spun it about itself. `rz` now returns to 0
   so the -π/2 about Y swings the plate axis to +Z, square to the lens.
4. Camera dolly target was z=1.32, which is *behind* the near plate face (z≈1.76
   once scaled). Corrected to 2.45–2.75.
5. Director had no aspect awareness — the object sat off-screen in portrait. All
   horizontal targets now blend between a phone and a desktop framing.

## Usage-limit interruptions
None so far.
