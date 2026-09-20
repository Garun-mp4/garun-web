import React from 'react';

export function Footer(): React.ReactElement {
  return <footer className="footer">
    <div className="footer__inner">
      <div className="footer__top">
        <div className="footer__brand">
          <img src="/assets/logo-mark.svg" alt="" width="40" height="40" />
          <p>Frontend-разработка лендингов<br/>и интерактивных сайтов.</p>
        </div>
        <nav aria-label="Навигация в подвале">
          <a href="/">Главная</a><a href="/services">Услуги</a><a href="/projects">Проекты</a><a href="/about">Обо мне</a><a href="/contact">Связаться</a>
        </nav>
        <div className="footer__links">
          <a href="https://t.me/garun_web" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href="https://wa.me/79964206569" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <span className="footer__badge"><span>GARUN / FRONTEND</span><a href="/calculator">Калькулятор проекта ↗</a></span>
        </div>
      </div>
      <div className="footer__meta">
        <span>© 2026 Гарун Сулейманов</span>
        <a href="/privacy.html">Политика конфиденциальности</a>
        <span>RU <span aria-hidden="true">/</span> ONLINE</span>
      </div>
    </div>
  </footer>;
}
