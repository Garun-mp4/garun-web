import React from 'react';
import { values } from '../../data/values.js';
import { ValueGlyph } from '../../components/ui/Icons.js';

interface State { active: number; }

export class Values extends React.Component<Record<string, never>, State> {
  state: State = { active: 0 };
  private rowRefs: Array<HTMLDivElement | null> = [];
  private raf = 0;

  componentDidMount(): void {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll);
    this.onScroll();
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    cancelAnimationFrame(this.raf);
  }

  onScroll = (): void => {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      const target = window.innerHeight * 0.52;
      let active = this.state.active;
      let best = Number.POSITIVE_INFINITY;
      this.rowRefs.forEach((node, index) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - target);
        if (distance < best) { best = distance; active = index; }
      });
      if (active !== this.state.active) this.setState({ active });
    });
  };

  render(): React.ReactElement {
    return <section className="values section-dark" id="principles" aria-label="Принципы работы">
      <div className="section-inner values__inner">
        {values.map((item, index) => <div className={`value-row${this.state.active === index ? ' is-active' : ''}`} ref={(node: HTMLDivElement | null) => { this.rowRefs[index] = node; }} key={item.label}>
          <div className="value-row__label"><strong>{item.label}</strong><span className="value-row__icon"><ValueGlyph type={item.icon} /></span></div>
          <p>{item.text}</p>
        </div>)}
      </div>
    </section>;
  }
}
