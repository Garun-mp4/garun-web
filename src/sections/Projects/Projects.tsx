import React from 'react';
import { projects } from '../../data/projects.js';
import { ExternalIcon } from '../../components/ui/Icons.js';

export function Projects(): React.ReactElement {
  return <section className="projects section-light" id="projects" aria-labelledby="projects-title">
    <div className="section-inner">
      <div className="projects__intro">
        <h2 className="display-title" id="projects-title">ПРОЕКТЫ</h2>
        <div className="projects__intro-copy">
          <span className="label">ПОРТФОЛИО</span>
          <p>Реальные опубликованные проекты для услуг, локального бизнеса и продуктов.</p>
        </div>
      </div>

      <div className="project-list">
        {projects.map(project => <a className="project-row" href={project.url} target="_blank" rel="noopener noreferrer" key={project.id} data-cursor-label="ОТКРЫТЬ САЙТ">
          <span className="project-row__bg" aria-hidden="true"></span>
          <span className="project-row__meta"><small>CASE {project.index}</small><small>{project.category}</small></span>
          <span className="project-row__main">
            <span className="project-row__preview"><img src={project.image} srcSet={`${project.image.replace('.webp', '-700.webp')} 700w, ${project.image} 1400w`} sizes="(max-width: 809px) calc(100vw - 32px), 210px" width="1400" height="796" alt={project.alt} loading="lazy" decoding="async" /></span>
            <span className="project-row__title">{project.title}</span>
            <span className="project-row__format">{project.format}</span>
            <span className="project-row__icon"><ExternalIcon /></span>
          </span>
        </a>)}
      </div>
    </div>
  </section>;
}
