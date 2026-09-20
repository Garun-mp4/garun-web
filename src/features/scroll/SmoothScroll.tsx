import React from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let activeLenis: Lenis | null = null;

export function getSmoothScroll(): Lenis | null {
  return activeLenis;
}

export function SmoothScroll(): null {
  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      lerp: 0.1,
      autoRaf: true,
      anchors: true,
      autoToggle: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });

    activeLenis = lenis;
    const syncScrollLock = (): void => {
      const isLocked = document.body.classList.contains('menu-open') || document.body.classList.contains('modal-open');
      if (isLocked) lenis.stop();
      else lenis.start();
    };
    const bodyObserver = new MutationObserver(syncScrollLock);
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    syncScrollLock();

    return () => {
      bodyObserver.disconnect();
      if (activeLenis === lenis) activeLenis = null;
      lenis.destroy();
    };
  }, []);

  return null;
}
