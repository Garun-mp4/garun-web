import React from 'react';
import { LayerButton } from '../ui/LayerButton.js';
import { ChevronDown, MenuIcon } from '../ui/Icons.js';

interface State { servicesOpen: boolean; menuOpen: boolean; inverse: boolean; }

export class Header extends React.Component<Record<string, never>, State> {
  state: State = { servicesOpen: false, menuOpen: false, inverse: false };
  private rootRef = React.createRef<HTMLElement>();
  private themeRaf: number | null = null;

  componentDidMount(): void {
    document.addEventListener('pointerdown', this.handleOutside);
    document.addEventListener('keydown', this.handleKey);
    window.addEventListener('scroll', this.scheduleThemeUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleThemeUpdate, { passive: true });
    this.scheduleThemeUpdate();
  }

  componentWillUnmount(): void {
    document.removeEventListener('pointerdown', this.handleOutside);
    document.removeEventListener('keydown', this.handleKey);
    window.removeEventListener('scroll', this.scheduleThemeUpdate);
    window.removeEventListener('resize', this.scheduleThemeUpdate);
    if (this.themeRaf !== null) window.cancelAnimationFrame(this.themeRaf);
    document.body.classList.remove('menu-open');
  }


  scheduleThemeUpdate = (): void => {
    if (this.themeRaf !== null) window.cancelAnimationFrame(this.themeRaf);
    this.themeRaf = window.requestAnimationFrame(() => {
      this.themeRaf = null;
      const probeY = window.innerWidth <= 809.98 ? 38 : 54;
      const darkSurfaces = Array.from(
        document.querySelectorAll<HTMLElement>('.section-dark, .about-frame, .final-cta__panel'),
      );
      const inverse = darkSurfaces.some(element => {
        const rect = element.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom >= probeY;
      });
      if (inverse !== this.state.inverse) this.setState({ inverse });
    });
  };

  handleOutside = (event: Event): void => {
    if (this.state.servicesOpen && this.rootRef.current && !this.rootRef.current.contains(event.target as Node)) {
      this.setState({ servicesOpen: false });
    }
  };

  handleKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.setState({ servicesOpen: false, menuOpen: false });
      document.body.classList.remove('menu-open');
    }
  };

  toggleMenu = (): void => {
    this.setState(prev => {
      const next = !prev.menuOpen;
      document.body.classList.toggle('menu-open', next);
      return { ...prev, menuOpen: next, servicesOpen: false };
    });
  };

  closeMenu = (): void => {
    this.setState({ menuOpen: false });
    document.body.classList.remove('menu-open');
  };

  render(): React.ReactElement {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const active = (route: string): string => path === route ? ' is-active' : '';

    return <header className={`site-header${this.state.inverse ? ' is-inverse' : ''}`} ref={this.rootRef}>
      <a className="brand-mark" href="/" aria-label="На первый экран">
        <img src={this.state.inverse ? '/assets/logo-mark-light.svg' : '/assets/logo-mark.svg'} alt="" width="40" height="40" />
      </a>

      <nav className="desktop-nav" aria-label="Основная навигация">
        <div className={`services-control${this.state.servicesOpen ? ' is-open' : ''}`}>
          <a className={`nav-control nav-control--services${active('/services')}`} href="/services" onClick={() => this.setState({ servicesOpen: false })}>
            <span className="nav-control__base">УСЛУГИ</span><span className="nav-control__hover" aria-hidden="true">УСЛУГИ</span>
          </a>
          <button className="nav-control nav-control--chevron" type="button" aria-label="Открыть список услуг" aria-expanded={this.state.servicesOpen} aria-controls="services-dropdown" onClick={() => this.setState(prev => ({ servicesOpen: !prev.servicesOpen }))}>
            <span className="nav-control__base"><ChevronDown /></span><span className="nav-control__hover" aria-hidden="true"><ChevronDown /></span>
          </button>
          <div id="services-dropdown" className="services-dropdown" hidden={!this.state.servicesOpen}>
            <a href="/services#service-01" onClick={() => this.setState({ servicesOpen: false })}>ЛЕНДИНГ ПОД КЛЮЧ</a>
            <a href="/services#service-02" onClick={() => this.setState({ servicesOpen: false })}>FRONTEND-РАЗРАБОТКА</a>
            <a href="/services#service-03" onClick={() => this.setState({ servicesOpen: false })}>ИНТЕРАКТИВ / ДОРАБОТКА</a>
          </div>
        </div>
        <a className={`nav-control nav-control--single${active('/projects')}`} href="/projects"><span className="nav-control__base">ПРОЕКТЫ</span><span className="nav-control__hover" aria-hidden="true">ПРОЕКТЫ</span></a>
        <a className={`nav-control nav-control--single${active('/about')}`} href="/about"><span className="nav-control__base">ОБО МНЕ</span><span className="nav-control__hover" aria-hidden="true">ОБО МНЕ</span></a>
      </nav>

      <div className="header-contact desktop-only">
        <LayerButton href="/contact" variant={this.state.inverse ? 'light' : 'dark'} portrait>СВЯЗАТЬСЯ</LayerButton>
      </div>

      <button className="mobile-menu-trigger" type="button" aria-label={this.state.menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={this.state.menuOpen} aria-controls="mobile-menu" onClick={this.toggleMenu}>
        <span>МЕНЮ</span><MenuIcon open={this.state.menuOpen} />
      </button>

      <div className={`mobile-menu-overlay${this.state.menuOpen ? ' is-open' : ''}`} id="mobile-menu" aria-hidden={!this.state.menuOpen}>
        <div className="mobile-menu-panel">
          <a href="/services" onClick={this.closeMenu}>УСЛУГИ</a>
          <a href="/projects" onClick={this.closeMenu}>ПРОЕКТЫ</a>
          <a href="/about" onClick={this.closeMenu}>ОБО МНЕ</a>
          <a href="/calculator" onClick={this.closeMenu}>КАЛЬКУЛЯТОР</a>
          <a href="/contact" onClick={this.closeMenu}>СВЯЗАТЬСЯ</a>
        </div>
      </div>
    </header>;
  }
}
