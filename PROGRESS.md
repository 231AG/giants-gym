# GIANTS GYM — Build Progress

> Living checkpoint file (Section 0.2 of the brief). Reflects the **final** state.

## Status
**All 11 steps of the Development Order are complete.** Lint clean, production
build clean, no console errors across the full scroll on desktop, mobile or with
reduced motion. Screenshots for every step are in `/screenshots`.

---

## Environment findings (Step 1)
- Empty repo on `claude/giants-gym-3d-fitness-ren9hb`. Node v22.22.2, npm 10.9.7.
- **Visual tooling — obtained.** Playwright's bundled browsers are absent, but a
  Chromium build ships at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  and does **WebGL 2.0** headless under `--use-gl=angle --use-angle=swiftshader
  --enable-unsafe-swiftshader`. `scripts/shoot.mjs` drives the *running* app —
  scroll (through Lenis, not `window.scrollTo`), pointer moves, taps, viewport
  resizes, reduced-motion emulation — so every 3D and scroll decision below was
  made against a real render, not from imagination.
- **Skills — none available.** `SearchSkills` for `three.js`, `webgl`,
  `react three fiber`, `3d web development`, `design taste`, `design critique`
  and `frontend animation` returned **zero results**; no such skill exists in
  this environment to install. Fell back to own judgment plus the screenshot
  loop. The design review in Step 11 was run by me against the captured set.
- **Unsplash MCP — unavailable** ("email address has not been confirmed"). Rather
  than escalate, the campaign imagery is *rendered from the project's own 3D
  geometry* via the `/render` route and `scripts/render-media.mjs`. Better for a
  portfolio piece than stock: brand-consistent, self-produced, zero licensing.

---

## Decisions made autonomously (Section 0.3)

**Accent colour: ELECTRIC LIME `#D7FF3E`.** Chosen over bold orange and deep red.
On `#050506` lime reaches roughly 16:1 luminance contrast, so a *single* accent
can carry CTAs, focus rings, active states and small mono labels at AAA. Orange
lands near 8:1 and deep red near 4:1 — either would have forced a second accent
colour for small UI and broken the one-accent rule the brief sets. It also reads
"high-visibility industrial / voltage" rather than the expected gym red-orange.

Other calls:
- **Type:** Anton (condensed heavy display) + Inter (body) + JetBrains Mono
  (industrial data labels). Anton's single weight is the point — poster, not corporate.
- **Procedural geometry over GLB assets.** Lathe profiles authored in code: no
  asset payload, silhouettes tunable while iterating, and segment counts droppable
  wholesale on low-power devices.
- **Procedural lighting over an HDRI.** A baked rig of drei `<Lightformer>`s
  (`frames={1}`) — works offline, adds nothing to the network cost.
- **One persistent canvas** behind the document rather than per-section canvases.
  This is what makes the Section 8 transition continuous instead of a cut.
- **No post-processing library.** Grain and vignette are an SVG `feTurbulence`
  tile in CSS, which costs ~0 bytes and composites on the GPU.
- **GSAP used in exactly one place** (the Day 01/30/365 timeline), where a single
  scrubbed timeline over eight targets genuinely beats hand-synced ranges. It is
  dynamically imported, so it stays out of the initial bundle.
- **No trainer photography.** Placeholder headshots are the fastest way to make a
  real gym's site look fake; the coaches are a typographic ledger instead.

---

## Bugs found by looking at real renders

1. `display-xl` at `17vw` clipped the top of the hero headline on 16:9. Every
   display size is now bounded on both axes with `min(vw, svh)`.
2. Hero reveal delays were hard-coded to follow the intro, so a returning visitor
   (curtain skipped) waited 2.9s for a CTA. The offset now derives from
   `lib/intro-state.ts`, shared by the curtain and the hero.
3. **The forge transition pointed the camera down the handle.** Euler order is
   XYZ, so `rz = π/2` stood the bar on end and put its long axis along world Y —
   the following Y-rotation then only spun it about itself. `rz` now returns to 0
   so the −π/2 about Y swings the plate axis to +Z, square to the lens.
4. The camera dolly target (z = 1.32) was *behind* the near plate face (z ≈ 1.76
   once scaled). Corrected to 2.45–2.75.
5. The director had no aspect awareness — the object sat off-screen in portrait.
   All horizontal targets now blend between a phone and a desktop framing.
6. **The intro curtain was client-only**, so the hero painted first and was then
   covered once React hydrated — the exact flash the curtain exists to prevent.
   It now renders on the server, with a blocking pre-paint script that removes it
   for anyone who should not see it.
7. **Horizontal overflow of 35px at 390px wide** (document 425px). Two full-width
   elements were scaled/translated past the viewport. Fixed at source, with
   `overflow-x: clip` — not `hidden`, which would create a scroll container and
   break every `position: sticky` section — as a safety net.
8. **`remeasureAll()` ran every frame.** Lint caught `last` never being
   reassigned in the RAF loop, which meant a full layout read of every section on
   every frame after the first 400ms.
9. The equipment gallery scaled its piece in from zero, leaving it a fifth of its
   size whenever the deferred bundle landed late. Removed — the piece is already
   racked when you arrive.
10. The Strength headline rises 42% of its own height, straight over the section
    label. The label now leaves before it gets there.
11. With reduced motion the static SQUAT/PRESS/LIFT/PUSH list ran into the
    object's static pose. Left-aligned and width-capped in that mode.
12. Mobile hero: the object sat behind the address line and headline. It now sits
    high and small, clear of the copy.

---

## Steps
- [x] 1. Inspect repository and initialise
- [x] 2. Brand system
- [x] 3. Hero
- [x] 4. 3D interaction + motion physics — `screenshots/hero-0*.png`
- [x] 5. Scroll storytelling — `screenshots/story-*.png`, `transition-*.png`
- [x] 6. Training interaction — `story-05`, `mobile-training.png`
- [x] 7. Gym experience — `story-08`, `mobile-space.png`
- [x] 8. Membership — `section-membership.png`, `mobile-membership.png`
- [x] 9. Responsive — `mobile-*.png`; no horizontal overflow at 390/768/1600
- [x] 10. Performance — 174 kB First Load JS; 283 kB at load, 603 kB after 3D
- [x] 11. Test + polish — design review run against the captured set; the 12
      fixes above are its output

## Usage-limit interruptions
One. The session was interrupted once mid-build (during the first typecheck pass
after the Forge section was written). No work was lost — the repo was already
committed through the previous milestone and this file recorded the next action.
Work resumed from the recorded point without re-planning. No back-off polling was
needed, as the limit had already reset when the session continued.
