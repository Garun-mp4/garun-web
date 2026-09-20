import React from 'react';

export function Footer(): React.ReactElement {
  return <footer className="footer">
    <div className="footer__inner">
      <div className="footer__top">
        <div className="footer__brand">
          <img src="/assets/logo-mark.svg" alt="" width="48" height="48" />
          <p>Frontend-разработка лендингов<br/>и интерактивных сайтов.</p>
        </div>
        <nav aria-label="Навигация в подвале">
          <a href="#top">Главная</a><a href="#services">Услуги</a><a href="#projects">Проекты</a><a href="#about">Обо мне</a><a href="#calculator">Калькулятор</a><a href="#contact">Связаться</a>
        </nav>
        <div className="footer__links">
          <a href="https://t.me/garun_web" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href="https://github.com/Garun-mp4" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
      <div className="footer__meta">
        <span>© 2026 Гарун Сулейманов</span>
        <a href="/privacy.html">Политика конфиденциальности</a>
        <span>Работаю онлайн</span>
      </div>
    </div>
  </footer>;
}
