import React from 'react';
import type { ValueIcon } from '../../types/content.js';

export function ChevronDown(): React.ReactElement {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

export function ExternalIcon(): React.ReactElement {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-8 8"/><path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/></svg>;
}

export function ArrowLeftIcon(): React.ReactElement {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H4M10 6l-6 6 6 6" /></svg>;
}

export function ArrowRightIcon(): React.ReactElement {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>;
}

export function PlusIcon({ open = false }: { open?: boolean }): React.ReactElement {
  return <span className={`plus-icon${open ? ' is-open' : ''}`} aria-hidden="true"><i/><i/></span>;
}

export function MenuIcon({ open = false }: { open?: boolean }): React.ReactElement {
  return <span className={`menu-glyph${open ? ' is-open' : ''}`} aria-hidden="true"><i/><i/></span>;
}

export function ValueGlyph({ type }: { type: ValueIcon }): React.ReactElement {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'cursor') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M5 4l6.5 15 2.2-6.1L20 10z"/><path d="m14.5 14.5 4 4"/></svg>;
  if (type === 'detail') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="12" cy="12" r="2.5"/></svg>;
  if (type === 'target') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>;
  if (type === 'feedback') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M5 5h14v10H9l-4 4z"/></svg>;
  if (type === 'chat') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><path d="M20 11a8 8 0 0 1-11.6 7.2L4 20l1.8-4A8 8 0 1 1 20 11z"/></svg>;
  if (type === 'responsive') return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><rect x="3" y="5" width="14" height="10" rx="1.5"/><path d="M8 19h4M10 15v4"/><rect x="17" y="8" width="4" height="10" rx="1"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>;
}
