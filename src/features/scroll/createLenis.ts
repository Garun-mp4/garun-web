import Lenis from 'lenis';

export function createLenis(): Lenis {
  return new Lenis({
    duration: 2,
    lerp: 0.1,
    syncTouch: true,
    autoRaf: true,
    anchors: true,
    autoToggle: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  });
}
