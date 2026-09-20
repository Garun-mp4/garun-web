import Lenis from 'lenis';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 809.98px)';

const DESKTOP_TOUCH_PROFILE = {
  syncTouchLerp: 0.075,
  touchInertiaExponent: 1.7,
} as const;

const MOBILE_TOUCH_PROFILE = {
  // Keep touch tracking immediate, but let the release settle faster.
  syncTouchLerp: 0.12,
  // Reduce the extra distance added by the last finger movement.
  touchInertiaExponent: 1.5,
} as const;

export function getLenisOptions(isMobileViewport: boolean) {
  return {
    duration: 2,
    lerp: 0.1,
    syncTouch: true,
    ...(isMobileViewport ? MOBILE_TOUCH_PROFILE : DESKTOP_TOUCH_PROFILE),
    autoRaf: true,
    anchors: true,
    autoToggle: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  };
}

export function createLenis(): Lenis {
  const isMobileViewport = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;

  return new Lenis(getLenisOptions(isMobileViewport));
}
