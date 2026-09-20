import React from 'react';

export class About extends React.Component {
  private sectionRef = React.createRef<HTMLElement>();
  private frameRef = React.createRef<HTMLDivElement>();
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
      const section = this.sectionRef.current;
      const frame = this.frameRef.current;
      if (!section || !frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = section.getBoundingClientRect();
      const revealProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
      const scale = 0.5 + revealProgress * 0.5;
      frame.style.transform = `scale(${scale.toFixed(4)})`;
    });
  };

  render(): React.ReactElement {
    return <section className="about-trigger" id="about" ref={this.sectionRef} aria-labelledby="about-title">
      <div className="about-frame" ref={this.frameRef}>
        <div className="about-frame__content">
          <div className="about-identity">
            <div className="about-portrait"><img src="/images/portrait/portrait-about.webp" srcSet="/images/portrait/portrait-about-384.webp 384w, /images/portrait/portrait-about.webp 768w" sizes="(max-width: 809px) 110px, (max-width: 1199px) 128px, 160px" alt="Гарун — frontend-разработчик" width="768" height="768" loading="lazy" decoding="async" /></div>
            <h2 id="about-title">ПРИВЕТ — Я<br/>ГАРУН</h2>
          </div>
          <div className="about-copy">
            <span className="label label--dark">ОБО МНЕ</span>
            <p>Делаю аккуратные лендинги, которые можно запускать, показывать клиентам и развивать после старта.</p>
            <p>Работаю со структурой, frontend, адаптивом, формами и интерактивом. Без выдуманных метрик и обещаний «магических продаж».</p>
          </div>
        </div>
      </div>
    </section>;
  }
}
