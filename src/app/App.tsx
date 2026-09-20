import React from 'react';
import { Header } from '../components/layout/Header.js';
import { Hero } from '../sections/Hero/Hero.js';
import { Services } from '../sections/Services/Services.js';
import { Projects } from '../sections/Projects/Projects.js';
import { About } from '../sections/About/About.js';
import { Values } from '../sections/Values/Values.js';
import { Calculator } from '../sections/Calculator/Calculator.js';
import { FAQ } from '../sections/FAQ/FAQ.js';
import { FinalCTA } from '../sections/CTA/FinalCTA.js';
import { Footer } from '../sections/Footer/Footer.js';
import { ContactPage } from '../sections/Contact/ContactPage.js';
import { ContactModal } from '../features/contact/ContactModal.js';
import { CustomCursor } from '../features/cursor/CustomCursor.js';

type RoutePath = '/' | '/services' | '/projects' | '/about' | '/contact' | '/calculator' | '/404';

function getRoutePath(): RoutePath {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path === '/services' || path === '/projects' || path === '/about' || path === '/contact' || path === '/calculator') {
    return path;
  }
  return '/404';
}

function NotFound(): React.ReactElement {
  return <section className="not-found section-light" aria-labelledby="not-found-title">
    <div className="section-inner not-found__inner">
      <span className="label">404</span>
      <h1 className="display-title" id="not-found-title">СТРАНИЦА<br/>НЕ НАЙДЕНА</h1>
      <p>Похоже, такой страницы пока нет. Вернитесь на главную или откройте проекты.</p>
      <div className="not-found__actions">
        <a className="plain-action plain-action--dark" href="/">НА ГЛАВНУЮ</a>
        <a className="plain-action plain-action--outline" href="/projects">К ПРОЕКТАМ</a>
      </div>
    </div>
  </section>;
}

function RouteView({ route }: { route: RoutePath }): React.ReactElement {
  switch (route) {
    case '/services':
      return <main id="main"><Services /><FAQ /><FinalCTA /></main>;
    case '/projects':
      return <main id="main"><Projects /><FinalCTA /></main>;
    case '/about':
      return <main id="main"><About /><Values /><FinalCTA /></main>;
    case '/contact':
      return <main id="main"><ContactPage /></main>;
    case '/calculator':
      return <main id="main"><Calculator /><FinalCTA /></main>;
    case '/404':
      return <main id="main"><NotFound /></main>;
    case '/':
    default:
      return <main id="main">
        <Hero />
        <Services />
        <Projects featuredOnly />
        <About />
        <Values />
        <FAQ />
        <FinalCTA />
      </main>;
  }
}

export function App(): React.ReactElement {
  const route = getRoutePath();

  React.useEffect(() => {
    const titles: Record<RoutePath, string> = {
      '/': 'Гарун — лендинги и frontend-разработка',
      '/services': 'Услуги — Гарун / Frontend',
      '/projects': 'Проекты — Гарун / Frontend',
      '/about': 'Обо мне — Гарун / Frontend',
      '/contact': 'Контакты — Гарун / Frontend',
      '/calculator': 'Калькулятор — Гарун / Frontend',
      '/404': 'Страница не найдена — Гарун / Frontend',
    };
    document.title = titles[route];
    const hashTarget = window.location.hash ? document.querySelector(window.location.hash) : null;
    if (hashTarget) {
      window.requestAnimationFrame(() => hashTarget.scrollIntoView({ block: 'start' }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  return <div className="app-shell">
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <Header />
    <RouteView route={route} />
    <Footer />
    <ContactModal />
    <CustomCursor />
    <div className="noise" aria-hidden="true"></div>
  </div>;
}
