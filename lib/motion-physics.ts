/**
 * Motion physics for objects that are supposed to weigh something.
 *
 * The whole 3D layer runs on these two primitives rather than on tweens, because
 * a tween has no memory of its own velocity — and velocity is exactly what reads
 * as mass. A heavy object starts late, keeps travelling after the input stops,
 * and settles with one small overshoot rather than snapping.
 */

/** Fixed physics step (s). We substep so behaviour is identical at 30 and 144fps. */
const STEP = 1 / 120;
const MAX_STEPS = 8;

export class HeavySpring {
  value: number;
  velocity = 0;
  private stiffness: number;
  private damping: number;
  private mass: number;
  private acc = 0;

  /**
   * @param stiffness  how hard it is pulled to target. Low = sluggish, heavy.
   * @param damping    resistance. Below critical (2*sqrt(k*m)) you get overshoot.
   * @param mass       inertia. Higher = later start, longer carry.
   */
  constructor(value = 0, stiffness = 90, damping = 16, mass = 1.6) {
    this.value = value;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  /** Retune live (used when a section wants a heavier or snappier response). */
  set(stiffness: number, damping: number, mass = this.mass) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  /** Kick the spring — used for impacts, where energy arrives as velocity. */
  impulse(v: number) {
    this.velocity += v;
  }

  update(target: number, dt: number) {
    this.acc += Math.min(dt, 0.1);
    let steps = 0;
    while (this.acc >= STEP && steps < MAX_STEPS) {
      const force = (target - this.value) * this.stiffness;
      const accel = (force - this.velocity * this.damping) / this.mass;
      this.velocity += accel * STEP;
      this.value += this.velocity * STEP;
      this.acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;
    return this.value;
  }

  /** Teleport (reduced-motion, or re-entry after being off-screen). */
  reset(value: number) {
    this.value = value;
    this.velocity = 0;
    this.acc = 0;
  }
}

/**
 * A decaying oscillation used for the settle after an impact — the "steel still
 * ringing" detail. Amplitude is deliberately tiny; the brief warns against shake.
 */
export class ImpactShake {
  private t = Infinity;
  private amplitude = 0;
  private frequency = 26;
  private decay = 9;

  fire(amplitude: number, frequency = 26, decay = 9) {
    this.t = 0;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.decay = decay;
  }

  get active() {
    return this.t < 1.2;
  }

  update(dt: number) {
    if (!this.active) return 0;
    this.t += dt;
    return (
      Math.sin(this.t * this.frequency) *
      this.amplitude *
      Math.exp(-this.t * this.decay)
    );
  }

  reset() {
    this.t = Infinity;
  }
}

/** Shared timing scale (ms) — mirrored in CSS custom properties. */
export const DURATION = {
  micro: 0.18,
  ui: 0.42,
  story: 1.0,
  storyLong: 1.5,
} as const;

/** Weighted easing curves. `heavy` starts late; `impact` arrives fast and settles. */
export const EASE = {
  heavy: [0.16, 1, 0.3, 1] as const,
  impact: [0.2, 0.9, 0.1, 1] as const,
  out: [0.33, 1, 0.68, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};
