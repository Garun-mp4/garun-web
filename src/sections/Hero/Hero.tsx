import React from 'react';
import { LayerButton } from '../../components/ui/LayerButton.js';
import { projects } from '../../data/projects.js';

const words = 'Проектирую структуру, собираю frontend, адаптив и интерактив — от формы до квиза и калькулятора.'.split(' ');

export function Hero(): React.ReactElement {
  const previewFrameRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const frame = previewFrameRef.current;
    if (!frame) return undefined;

    const syncShotWidth = (): void => {
      frame.style.setProperty('--hero-shot-width', `${Math.max(1, (frame.clientWidth - 12) / 2)}px`);
    };
    syncShotWidth();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncShotWidth) : null;
    observer?.observe(frame);
    return () => observer?.disconnect();
  }, []);

  const previewProjects = [...projects, ...projects];

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
        <div className="hero-preview__frame" ref={previewFrameRef}>
          <div className="hero-preview__track">
            {previewProjects.map((project, index) => {
              const duplicate = index >= projects.length;
              const responsiveImage = project.image.replace('.webp', '-700.webp');
              return <div className="hero-preview__shot" aria-hidden={duplicate || undefined} key={`${project.id}-${duplicate ? 'copy' : 'base'}`}>
                <img src={project.image} srcSet={`${responsiveImage} 700w, ${project.image} 1400w`} sizes="(max-width: 809px) 32vw, 17vw" width="1400" height="795" alt={duplicate ? '' : project.alt} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
              </div>;
            })}
          </div>
        </div>
        <div className="hero-preview__caption"><span>ПРОЕКТЫ</span><i></i><span>GARUN / FRONTEND</span></div>
      </a>
    </div>
  </section>;
}
