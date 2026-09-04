"use client";

/**
 * Whether the opening curtain will actually play on this load.
 *
 * The hero staggers itself to land *after* the intro — but a returning visitor
 * skips the intro, and without this they would sit staring at a headline for
 * nearly three seconds before a CTA appeared. Resolved synchronously so the hero
 * and the curtain never disagree about the timeline they are on.
 */
const SEEN_KEY = "giants:intro";

export function willPlayIntro(): boolean {
  if (typeof window === "undefined") return true;
  const params = new URLSearchParams(window.location.search);
  if (params.has("nointro")) return false;
  if (params.has("intro")) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode — the curtain simply plays again */
  }
}

/** Seconds the curtain occupies. The hero's own reveal is offset by this. */
export const INTRO_DURATION = 2.05;
