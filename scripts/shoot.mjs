/**
 * Visual-iteration harness.
 *
 * The bundled Playwright browsers are absent in this environment, but a Chromium
 * build ships at /opt/pw-browsers — and it does WebGL 2 via SwiftShader, so the
 * real scene renders headlessly. Everything here drives the *running* app:
 * scrolls to a real depth, moves the pointer, taps, resizes.
 *
 *   node scripts/shoot.mjs <preset> [--out dir] [--base url]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const ARGS = [
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--enable-unsafe-swiftshader",
  "--use-gl=angle",
  "--use-angle=swiftshader",
  "--force-color-profile=srgb",
  "--font-render-hinting=none",
];

const args = process.argv.slice(2);
const preset = args[0] ?? "all";
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const BASE = flag("base", "http://127.0.0.1:3000");
const OUT = flag("out", "screenshots");
const REDUCED = args.includes("--reduced");

const DESKTOP = { width: 1600, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function makeContext(browser, viewport) {
  return browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    hasTouch: viewport.width < 600,
    isMobile: viewport.width < 600,
    reducedMotion: REDUCED ? "reduce" : "no-preference",
  });
}

/** Scroll via the real wheel path so Lenis, the store and the 3D director all run. */
async function scrollTo(page, y, settle = 900) {
  await page.evaluate((target) => {
    const w = window;
    if (w.__lenisScrollTo) w.__lenisScrollTo(target);
    else window.scrollTo({ top: target, behavior: "auto" });
  }, y);
  await page.waitForTimeout(settle);
}

async function scrollToRatio(page, ratio, settle) {
  const max = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  await scrollTo(page, Math.round(max * ratio), settle);
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  console.log("  ✓", file);
}

async function ready(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  // Give the deferred WebGL bundle time to import, compile and bake the env map.
  await page.waitForTimeout(4200);
}

const presets = {
  /** The opening curtain, frame by frame. */
  async intro(browser) {
    const ctx = await makeContext(browser, DESKTOP);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?intro=1`, { waitUntil: "domcontentloaded" });
    for (const [ms, name] of [
      [120, "intro-01-black"],
      [480, "intro-02-impact"],
      [1000, "intro-03-giants"],
      [1750, "intro-04-open"],
      [2900, "intro-05-hero"],
    ]) {
      await page.waitForTimeout(ms - (presets._last ?? 0));
      presets._last = ms;
      await shot(page, name);
    }
    presets._last = 0;
    await ctx.close();
  },

  /** Hero at rest, then with the pointer parked in three places. */
  async hero(browser) {
    const ctx = await makeContext(browser, DESKTOP);
    const page = await ctx.newPage();
    await ready(page, `${BASE}/?nointro=1`);
    await shot(page, "hero-01-rest");
    await page.mouse.move(1450, 260);
    await page.waitForTimeout(1100);
    await shot(page, "hero-02-pointer-topright");
    await page.mouse.move(180, 780, { steps: 24 });
    await page.waitForTimeout(1100);
    await shot(page, "hero-03-pointer-bottomleft");
    // Mid-flight: caught 220ms after a fast pointer sweep, to show the lag.
    await page.mouse.move(1500, 200, { steps: 4 });
    await page.waitForTimeout(220);
    await shot(page, "hero-04-pointer-midflight");
    await ctx.close();
  },

  /** The Section 8 hero→training transition, sampled across its scroll range. */
  async transition(browser) {
    const ctx = await makeContext(browser, DESKTOP);
    const page = await ctx.newPage();
    await ready(page, `${BASE}/?nointro=1`);
    const box = await page.evaluate(() => {
      const el = document.getElementById("forge");
      if (!el) return null;
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { top, height: el.offsetHeight, vh: window.innerHeight };
    });
    if (!box) {
      console.log("  ! #forge not found");
      await ctx.close();
      return;
    }
    const span = box.height - box.vh;
    const steps = [0, 0.18, 0.36, 0.54, 0.72, 0.86, 0.97];
    for (const [i, p] of steps.entries()) {
      await scrollTo(page, Math.round(box.top + span * p), 1000);
      await shot(page, `transition-${String(i + 1).padStart(2, "0")}-p${Math.round(p * 100)}`);
    }
    await ctx.close();
  },

  /** Even scroll depths across the whole story. */
  async story(browser) {
    const ctx = await makeContext(browser, DESKTOP);
    const page = await ctx.newPage();
    await ready(page, `${BASE}/?nointro=1`);
    const ratios = [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.42, 0.5, 0.58, 0.66, 0.74, 0.82, 0.9, 0.97];
    for (const [i, r] of ratios.entries()) {
      await scrollToRatio(page, r, 850);
      await shot(page, `story-${String(i).padStart(2, "0")}-${Math.round(r * 100)}pct`);
    }
    await ctx.close();
  },

  /** Named section, by anchor id. `node scripts/shoot.mjs at --id training` */
  async at(browser) {
    const id = flag("id", "training");
    const offset = Number(flag("offset", "0"));
    const ctx = await makeContext(
      browser,
      flag("mobile", null) !== null ? MOBILE : DESKTOP,
    );
    const page = await ctx.newPage();
    await ready(page, `${BASE}/?nointro=1`);
    const top = await page.evaluate((sid) => {
      const el = document.getElementById(sid);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    }, id);
    if (top === null) {
      console.log(`  ! #${id} not found`);
      await ctx.close();
      return;
    }
    await scrollTo(page, Math.round(top + offset), 1100);
    await shot(page, flag("name", `at-${id}`));
    await ctx.close();
  },

  /** Mobile passes for hero, training and membership. */
  async mobile(browser) {
    const ctx = await makeContext(browser, MOBILE);
    const page = await ctx.newPage();
    await ready(page, `${BASE}/?nointro=1`);
    await shot(page, "mobile-01-hero");
    for (const id of ["training", "space", "membership", "join"]) {
      const top = await page.evaluate((sid) => {
        const el = document.getElementById(sid);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      }, id);
      if (top === null) continue;
      await scrollTo(page, Math.round(top + 40), 1000);
      await shot(page, `mobile-${id}`);
    }
    await ctx.close();
  },

  /** Console + page errors across the full scroll — the regression net. */
  async audit(browser) {
    const ctx = await makeContext(browser, DESKTOP);
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`console: ${m.text()}`);
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    await ready(page, `${BASE}/?nointro=1`);
    for (const r of [0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1]) await scrollToRatio(page, r, 500);
    const webgl = await page.evaluate(() => !!document.querySelector("canvas"));
    console.log(`  canvas present: ${webgl}`);
    console.log(errors.length ? `  ERRORS:\n   - ${errors.join("\n   - ")}` : "  no console errors");
    await ctx.close();
    if (errors.length) process.exitCode = 1;
  },
};

const order = ["intro", "hero", "transition", "story", "mobile", "audit"];

(async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, args: ARGS });
  const list = preset === "all" ? order : [preset];
  for (const name of list) {
    if (!presets[name]) {
      console.log(`unknown preset: ${name}`);
      continue;
    }
    console.log(`\n▸ ${name}`);
    await presets[name](browser);
  }
  await browser.close();
})();
