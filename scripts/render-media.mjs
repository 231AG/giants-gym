/**
 * Renders the campaign imagery from the project's own 3D geometry.
 * Run with the dev server up:  node scripts/render-media.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.env.BASE ?? "http://127.0.0.1:3000";

const JOBS = [
  { piece: "barbell", pose: 0, zoom: 1.55, w: 900, h: 1200, out: "program-strength" },
  { piece: "dumbbell", pose: 1, zoom: 1.7, w: 900, h: 1200, out: "program-mass" },
  { piece: "plate", pose: 2, zoom: 1.6, w: 900, h: 1200, out: "program-cardio" },
  { piece: "kettlebell", pose: 0, zoom: 1.5, w: 900, h: 1200, out: "program-functional" },
  { piece: "dumbbell", pose: 3, zoom: 1.85, w: 900, h: 1200, out: "program-personal" },
  { piece: "barbell", pose: 2, zoom: 1.25, w: 1600, h: 900, out: "space-wide-01" },
  { piece: "plate", pose: 1, zoom: 1.9, w: 1200, h: 900, out: "space-wide-02" },
  { piece: "kettlebell", pose: 1, zoom: 1.6, w: 1000, h: 1250, out: "space-tall-01" },
];

await mkdir("public/media", { recursive: true });
const browser = await chromium.launch({
  executablePath: CHROME,
  args: [
    "--no-sandbox",
    "--enable-unsafe-swiftshader",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--force-color-profile=srgb",
  ],
});

for (const job of JOBS) {
  const ctx = await browser.newContext({
    viewport: { width: job.w, height: job.h },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(
    `${BASE}/render?piece=${job.piece}&pose=${job.pose}&zoom=${job.zoom}`,
    { waitUntil: "networkidle" },
  );
  await page.waitForTimeout(3000);
  const path = `public/media/${job.out}.png`;
  await page.screenshot({ path });
  console.log("✓", path);
  await ctx.close();
}

await browser.close();
