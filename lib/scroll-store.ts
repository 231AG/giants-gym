"use client";

import { clamp, mapRange } from "./utils";

/**
 * A single mutable scroll snapshot shared by the DOM layer and the WebGL layer.
 *
 * This is deliberately *not* React state. The 3D director samples it every frame
 * inside `useFrame`; pushing scroll through React would re-render the tree 60
 * times a second for no reason. Components that genuinely need to re-render
 * (the nav, the active program) subscribe explicitly and are gated on change.
 */

export type Section = {
  id: string;
  /** Document-space bounds of the section, in px. */
  top: number;
  height: number;
};

type Listener = () => void;

class ScrollStore {
  /** Smoothed scroll position in px. */
  y = 0;
  /** Instantaneous scroll velocity, px/frame — feeds the object's lean. */
  velocity = 0;
  /** 0..1 over the whole document. */
  progress = 0;
  /** Viewport size, kept here so the 3D layer doesn't query layout per frame. */
  vw = 1280;
  vh = 800;
  /** Pointer in normalised device coords, -1..1. Damped by consumers, not here. */
  pointerX = 0;
  pointerY = 0;
  /** True once the pointer has actually moved (avoids a jump from 0,0 on load). */
  pointerActive = false;
  /** Set by the intro sequence; 0 while the curtain is up, 1 when handed over. */
  introProgress = 0;
  reducedMotion = false;
  /** Coarse pointer / low-power device — the 3D layer degrades on this. */
  lowPower = false;

  private sections = new Map<string, Section>();
  private listeners = new Set<Listener>();

  registerSection(id: string, el: HTMLElement) {
    this.measure(id, el);
    return () => this.sections.delete(id);
  }

  measure(id: string, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    this.sections.set(id, {
      id,
      top: rect.top + window.scrollY,
      height: rect.height,
    });
  }

  remeasureAll() {
    for (const id of Array.from(this.sections.keys())) {
      const el = document.getElementById(id);
      if (el) this.measure(id, el);
      else this.sections.delete(id);
    }
  }

  /**
   * 0 when the section's top reaches the bottom of the viewport, 1 when its
   * bottom leaves the top — i.e. the full travel of the section across the screen.
   */
  sectionProgress(id: string) {
    const s = this.sections.get(id);
    if (!s) return 0;
    return clamp(mapRange(this.y, s.top - this.vh, s.top + s.height, 0, 1));
  }

  /** 0 when the section top hits the viewport top, 1 when its bottom does. */
  pinProgress(id: string) {
    const s = this.sections.get(id);
    if (!s) return 0;
    return clamp(mapRange(this.y, s.top, s.top + s.height - this.vh, 0, 1));
  }

  has(id: string) {
    return this.sections.has(id);
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  emit() {
    for (const fn of this.listeners) fn();
  }
}

export const scrollStore = new ScrollStore();
