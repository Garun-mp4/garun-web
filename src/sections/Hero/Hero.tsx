import React from 'react';
import { LayerButton } from '../../components/ui/LayerButton.js';
import { projects } from '../../data/projects.js';

const words = 'Проектирую структуру, собираю frontend, адаптив и интерактив — от формы до квиза и калькулятора.'.split(' ');
const MARQUEE_DURATION_MS = 42_000;
type PointerSession = { pointerId: number; startX: number; startOffset: number; moved: boolean };

export function Hero(): React.ReactElement {
  const previewFrameRef = React.useRef<HTMLDivElement>(null);
  const previewTrackRef = React.useRef<HTMLDivElement>(null);
  const offsetRef = React.useRef(0);
  const itemStepRef = React.useRef(0);
  const cycleWidthRef = React.useRef(0);
  const pointerSessionRef = React.useRef<PointerSession | null>(null);
  const manualTimeoutRef = React.useRef<number | null>(null);
  const manualUntilRef = React.useRef(0);

  const applyTrackOffset = React.useCallback((rawOffset: number, normalize = true): number => {
    const cycleWidth = cycleWidthRef.current;
    const offset = normalize && cycleWidth > 0
      ? ((rawOffset % cycleWidth) + cycleWidth) % cycleWidth
      : rawOffset;
    offsetRef.current = offset;
    if (previewTrackRef.current) previewTrackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
    return offset;
  }, []);

  const moveBy = React.useCallback((direction: -1 | 1): void => {
    const track = previewTrackRef.current;
    const cycleWidth = cycleWidthRef.current;
    const itemStep = itemStepRef.current;
    if (!track || cycleWidth <= 0 || itemStep <= 0) return;

    let from = offsetRef.current;
    if (direction < 0 && from < itemStep) from += cycleWidth;
    const to = from + direction * itemStep;
    const duration = 460;
    if (manualTimeoutRef.current !== null) window.clearTimeout(manualTimeoutRef.current);
    track.style.transition = `transform ${duration}ms var(--ease)`;
    applyTrackOffset(to, false);
    manualUntilRef.current = performance.now() + duration;
    manualTimeoutRef.current = window.setTimeout(() => {
      track.style.transition = 'none';
      applyTrackOffset(to);
      manualUntilRef.current = 0;
      window.requestAnimationFrame(() => {
        if (previewTrackRef.current === track) track.style.transition = '';
      });
    }, duration + 20);
  }, [applyTrackOffset]);

  React.useEffect(() => {
    const frame = previewFrameRef.current;
    const track = previewTrackRef.current;
    if (!frame || !track) return undefined;

    const syncShotWidth = (): void => {
      frame.style.setProperty('--hero-shot-width', `${Math.max(1, frame.clientWidth - 8)}px`);
      const firstShot = track.querySelector<HTMLElement>('.hero-preview__shot');
      if (!firstShot) return;
      const marginRight = Number.parseFloat(getComputedStyle(firstShot).marginRight) || 0;
      itemStepRef.current = firstShot.getBoundingClientRect().width + marginRight;
      cycleWidthRef.current = itemStepRef.current * projects.length;
      applyTrackOffset(offsetRef.current);
    };
    syncShotWidth();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncShotWidth) : null;
    observer?.observe(frame);
    track.classList.add('is-controlled');

    let animationFrame = 0;
    let lastTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = (time: number): void => {
      const delta = Math.min(64, time - lastTime);
      lastTime = time;
      if (!reducedMotion && !pointerSessionRef.current && time >= manualUntilRef.current && cycleWidthRef.current > 0) {
        applyTrackOffset(offsetRef.current + (cycleWidthRef.current / MARQUEE_DURATION_MS) * delta);
      }
      animationFrame = window.requestAnimationFrame(tick);
    };
    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(animationFrame);
      if (manualTimeoutRef.current !== null) window.clearTimeout(manualTimeoutRef.current);
      track.classList.remove('is-controlled');
      track.style.transition = '';
    };
  }, [applyTrackOffset]);

  const onPreviewPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const frame = previewFrameRef.current;
    if (!frame) return;
    pointerSessionRef.current = { pointerId: event.pointerId, startX: event.clientX, startOffset: offsetRef.current, moved: false };
    frame.setPointerCapture(event.pointerId);
  };

  const onPreviewPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const session = pointerSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    const delta = event.clientX - session.startX;
    if (Math.abs(delta) > 6) session.moved = true;
    if (session.moved) applyTrackOffset(session.startOffset - delta);
  };

  const onPreviewPointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    const session = pointerSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    const frame = previewFrameRef.current;
    pointerSessionRef.current = null;
    if (frame?.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId);
    if (!session.moved && frame) {
      const rect = frame.getBoundingClientRect();
      moveBy(event.clientX < rect.left + rect.width / 2 ? -1 : 1);
    } else {
      manualUntilRef.current = performance.now() + 180;
    }
  };

  const onPreviewPointerCancel = (event: React.PointerEvent<HTMLDivElement>): void => {
    const session = pointerSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    pointerSessionRef.current = null;
    manualUntilRef.current = performance.now() + 180;
    if (previewFrameRef.current?.hasPointerCapture(event.pointerId)) previewFrameRef.current.releasePointerCapture(event.pointerId);
  };

  const onPreviewKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveBy(event.key === 'ArrowLeft' ? -1 : 1);
  };

  const onPreviewFrameClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

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

      <div className="hero-preview">
        <div
          className="hero-preview__frame"
          ref={previewFrameRef}
          role="group"
          tabIndex={0}
          aria-label="Листать кейсы"
          onPointerDown={onPreviewPointerDown}
          onPointerMove={onPreviewPointerMove}
          onPointerUp={onPreviewPointerUp}
          onPointerCancel={onPreviewPointerCancel}
          onKeyDown={onPreviewKeyDown}
          onClick={onPreviewFrameClick}
        >
          <div className="hero-preview__track" ref={previewTrackRef}>
            {previewProjects.map((project, index) => {
              const duplicate = index >= projects.length;
              const responsiveImage = project.image.replace('.webp', '-700.webp');
              return <div className="hero-preview__shot" aria-hidden={duplicate || undefined} key={`${project.id}-${duplicate ? 'copy' : 'base'}`}>
                <img src={project.image} srcSet={`${responsiveImage} 700w, ${project.image} 1400w`} sizes="(max-width: 809px) 70vw, 31vw" width="1400" height="795" alt={duplicate ? '' : project.alt} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
              </div>;
            })}
          </div>
        </div>
        <a className="hero-preview__caption" href="#projects" aria-label="Перейти к проектам"><span>ПРОЕКТЫ</span><i></i><span>GARUN / FRONTEND</span></a>
      </div>
    </div>
  </section>;
}
