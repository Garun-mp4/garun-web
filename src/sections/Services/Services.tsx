import React from 'react';
import { services } from '../../data/services.js';

export function Services(): React.ReactElement {
  return <section className="services section-dark" id="services" aria-labelledby="services-title">
    <div className="section-inner services__inner">
      <div className="services__intro">
        <h2 className="display-title display-title--light" id="services-title">ЧЕМ Я МОГУ<br/>ПОМОЧЬ</h2>
        <div className="services__intro-copy">
          <span className="label label--dark">УСЛУГИ</span>
          <p>Нужен новый лендинг, точная верстка или функциональность для уже работающей страницы?</p>
          <p>Соберу решение без лишних блоков — от структуры до готового frontend.</p>
        </div>
      </div>

      <div className="service-stack">
        {services.map((service, index) => <article className={`service-block service-block--${index + 1}`} id={`service-0${index + 1}`} key={service.index}>
          <div className="service-block__head">
            <span className="service-block__index">{service.index}</span>
            <h3>{service.title}</h3>
            <span className="service-block__arrow" aria-hidden="true">↙</span>
          </div>
          <div className="service-block__body">
            <p>{service.description}</p>
            <div className="service-sublist">
              {service.items.map((item, itemIndex) => <div className="service-sublist__row" key={item}>
                <span>{String(itemIndex + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>)}
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
