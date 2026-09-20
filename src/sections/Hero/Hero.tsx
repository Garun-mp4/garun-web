import React from 'react';
import { LayerButton } from '../../components/ui/LayerButton.js';

const words = 'Проектирую структуру, собираю frontend, адаптив и интерактив — от формы до квиза и калькулятора.'.split(' ');

export function Hero(): React.ReactElement {
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero__grid">
      <h1 className="hero__title" id="hero-title">
        <span className="hero-line"><span>ЛЕНДИНГИ, КОТОРЫЕ</span></span>
        <span className="hero-line"><span>ПОНЯТНО ОБЪЯСНЯЮТ</span></span>
        <span className="hero-line"><span>И ВЕДУТ К ЗАЯВКЕ</span></span>
      </h1>

      <div className="hero__support">
        <p className="hero__copy" aria-label="Описание услуги">
          {words.map((word, index) => <span className="hero-word" style={{ animationDelay: `${0.28 + index * 0.018}s` }} key={`${word}-${index}`}>{word}&nbsp;</span>)}
        </p>
        <div className="hero__actions">
          <LayerButton variant="dark" portrait href="/contact">ОБСУДИТЬ ПРОЕКТ</LayerButton>
          <LayerButton variant="outline" href="/projects">СМОТРЕТЬ ПРОЕКТЫ</LayerButton>
        </div>
      </div>

      <a className="hero-preview" href="#projects" aria-label="Перейти к проектам">
        <div className="hero-preview__frame">
          <div className="hero-preview__shot"><img src="/images/cases/velora.webp" srcSet="/images/cases/velora-700.webp 700w, /images/cases/velora.webp 1400w" sizes="(max-width: 809px) 41vw, 320px" width="1400" height="795" alt="Превью проекта VELORA" decoding="async" /></div>
          <div className="hero-preview__shot"><img src="/images/cases/forma-remonta.webp" srcSet="/images/cases/forma-remonta-700.webp 700w, /images/cases/forma-remonta.webp 1400w" sizes="(max-width: 809px) 41vw, 320px" width="1400" height="795" alt="Превью проекта Forma ремонта" decoding="async" /></div>
        </div>
        <div className="hero-preview__caption"><span>ПРОЕКТЫ</span><i></i><span>GARUN / FRONTEND</span></div>
      </a>
    </div>
  </section>;
}
