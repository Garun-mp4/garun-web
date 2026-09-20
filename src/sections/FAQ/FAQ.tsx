import React from 'react';
import { faq } from '../../data/faq.js';
import { PlusIcon } from '../../components/ui/Icons.js';

interface State { open: number | null; }

export class FAQ extends React.Component<Record<string, never>, State> {
  state: State = { open: null };

  render(): React.ReactElement {
    return <section className="faq-section section-light" id="faq" aria-labelledby="faq-title">
      <div className="section-inner">
        <h2 className="display-title faq-section__title" id="faq-title">ЧАСТЫЕ ВОПРОСЫ</h2>
        <div className="faq-list">
          {faq.map((item, index) => {
            const open = this.state.open === index;
            const questionId = `faq-question-${index + 1}`;
            const answerId = `faq-answer-${index + 1}`;
            return <div className={`faq-row${open ? ' is-open' : ''}`} key={item.question}>
              <button id={questionId} type="button" aria-expanded={open} aria-controls={answerId} onClick={() => this.setState({ open: open ? null : index })}>
                <span className="faq-row__index">({String(index + 1).padStart(2, '0')})</span>
                <span className="faq-row__question">{item.question}</span>
                <PlusIcon open={open} />
              </button>
              <div className="faq-row__answer" id={answerId} role="region" aria-labelledby={questionId} hidden={!open}><p>{item.answer}</p></div>
            </div>;
          })}
        </div>
      </div>
    </section>;
  }
}
