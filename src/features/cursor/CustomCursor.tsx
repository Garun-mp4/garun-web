import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ExternalIcon } from '../../components/ui/Icons.js';

interface State { active: boolean; label: string; slider: boolean; visible: boolean; }

export class CustomCursor extends React.Component<Record<string, never>, State> {
  state: State = { active: false, label: '', slider: false, visible: false };
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
    window.addEventListener('blur', this.onBlur);
  }

  componentWillUnmount(): void {
    document.documentElement.classList.remove('has-custom-cursor');
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('blur', this.onBlur);
    cancelAnimationFrame(this.raf);
  }

  onMove = (event: PointerEvent): void => {
    this.x = event.clientX;
    this.y = event.clientY;
    const target = document.elementFromPoint(this.x, this.y) as HTMLElement | null;
    const slider = Boolean(target?.closest('.hero-preview__frame'));
    const action = !slider ? target?.closest<HTMLElement>('[data-cursor-label]') : null;
    const nextState: State = {
      active: Boolean(action),
      label: action?.dataset.cursorLabel || '',
      slider,
      visible: true,
    };
    if (this.state.active !== nextState.active || this.state.label !== nextState.label || this.state.slider !== nextState.slider || !this.state.visible) {
      this.setState(nextState);
    }
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      if (this.cursorRef.current) this.cursorRef.current.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    });
  };

  onBlur = (): void => {
    if (this.state.visible) this.setState({ visible: false, active: false, label: '', slider: false });
  };

  render(): React.ReactElement | null {
    if (!this.enabled) return null;
    return <div className={`custom-cursor${this.state.active ? ' is-action' : ''}${this.state.slider ? ' is-slider' : ''}${this.state.visible ? ' is-visible' : ''}`} ref={this.cursorRef} aria-hidden="true">
      {this.state.slider ? <><span className="custom-cursor__arrow"><ArrowLeftIcon /></span><span className="custom-cursor__arrow"><ArrowRightIcon /></span></> : null}
      {this.state.active ? <span className="custom-cursor__action"><ExternalIcon />{this.state.label}</span> : null}
    </div>;
  }
}
