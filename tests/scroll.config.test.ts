import { describe, expect, it } from 'vitest';
import { getLenisOptions } from '../src/features/scroll/createLenis.js';

describe('Lenis scroll profiles', () => {
  it('keeps the desktop smoothing values unchanged', () => {
    const options = getLenisOptions(false);

    expect(options).toMatchObject({
      duration: 2,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 1.7,
    });
  });

  it('uses a faster, slightly lighter touch inertia profile on mobile', () => {
    const desktop = getLenisOptions(false);
    const mobile = getLenisOptions(true);

    expect(mobile.syncTouchLerp).toBeGreaterThan(desktop.syncTouchLerp);
    expect(mobile.touchInertiaExponent).toBeLessThan(desktop.touchInertiaExponent);
    expect(mobile.duration).toBe(desktop.duration);
    expect(mobile.lerp).toBe(desktop.lerp);
  });
});
