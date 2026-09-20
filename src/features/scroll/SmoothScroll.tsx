import React from 'react';
import type Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { createLenis } from './createLenis.js';

let activeLenis: Lenis | null = null;

export function getSmoothScroll(): Lenis | null {
  return activeLenis;
}

export function SmoothScroll(): null {
  React.useEffect(() => {
    const lenis = createLenis();

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
