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
import { ContactModal } from '../features/contact/ContactModal.js';
import { CustomCursor } from '../features/cursor/CustomCursor.js';

export function App(): React.ReactElement {
  return <div className="app-shell">
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <Header />
    <main id="main">
      <Hero />
      <Services />
      <Projects />
      <About />
      <Values />
      <Calculator />
      <FAQ />
      <FinalCTA />
    </main>
    <Footer />
    <ContactModal />
    <CustomCursor />
    <div className="noise" aria-hidden="true"></div>
  </div>;
}
