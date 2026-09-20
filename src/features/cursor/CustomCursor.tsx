import React from 'react';
import { ExternalIcon } from '../../components/ui/Icons.js';

interface State { active: boolean; label: string; light: boolean; }

export class CustomCursor extends React.Component<Record<string, never>, State> {
  state: State = { active: false, label: '', light: false };
  private cursorRef = React.createRef<HTMLDivElement>();
  private x = -100;
  private y = -100;
  private raf = 0;
  private enabled = false;

  componentDidMount(): void {
    this.enabled = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.enabled) return;
    document.documentElement.classList.add('has-custom-cursor');
    this.forceUpdate();
    window.addEventListener('pointermove', this.onMove, { passive: true });
    document.addEventListener('pointerover', this.onOver);
    document.addEventListener('pointerout', this.onOut);
  }

  componentWillUnmount(): void {
    document.documentElement.classList.remove('has-custom-cursor');
    window.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerover', this.onOver);
    document.removeEventListener('pointerout', this.onOut);
    cancelAnimationFrame(this.raf);
  }

  onMove = (event: PointerEvent): void => {
    this.x = event.clientX;
    this.y = event.clientY;
    const target = document.elementFromPoint(this.x, this.y) as HTMLElement | null;
    const dark = Boolean(target?.closest('.section-dark, .about-frame, .final-cta__panel'));
    if (dark !== this.state.light) this.setState({ light: dark });
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      if (this.cursorRef.current) this.cursorRef.current.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    });
  };

  onOver = (event: PointerEvent): void => {
    const target = event.target as HTMLElement | null;
    const action = target?.closest<HTMLElement>('[data-cursor-label]');
    if (action) this.setState({ active: true, label: action.dataset.cursorLabel || 'ОТКРЫТЬ' });
  };

  onOut = (event: PointerEvent): void => {
    const target = event.target as HTMLElement | null;
    const action = target?.closest<HTMLElement>('[data-cursor-label]');
    const related = event.relatedTarget as HTMLElement | null;
    if (action && (!related || !action.contains(related))) this.setState({ active: false, label: '' });
  };

  render(): React.ReactElement | null {
    if (!this.enabled) return null;
    return <div className={`custom-cursor${this.state.active ? ' is-action' : ''}${this.state.light ? ' is-light' : ''}`} ref={this.cursorRef} aria-hidden="true">
      {this.state.active ? <span><ExternalIcon />{this.state.label}</span> : null}
    </div>;
  }
}
