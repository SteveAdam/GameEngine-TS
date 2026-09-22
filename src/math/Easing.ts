// src/math/Easing.ts
// Each function takes t in [0, 1] and returns a curved t in [0, 1].
// Use: currentValue = lerp(start, end, easeFn(rawT))

export const Easing = {
  linear: (t: number) => t,

  // Slow start, fast end
  easeInQuad: (t: number) => t * t,

  // Fast start, slow end — probably your most-used easing for UI/camera work
  easeOutQuad: (t: number) => t * (2 - t),

  // Slow start AND end, fast middle — natural-feeling for most movement
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // A snappy overshoot-then-settle curve — nice for UI pop-in, item pickups
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}


