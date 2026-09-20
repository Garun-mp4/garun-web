import React from 'react';
import { calculatorSteps } from '../../features/calculator/calculator.config.js';
import { calculateEstimate, validateStep } from '../../features/calculator/calculator.logic.js';
import type { CalculatorAnswers, CalculatorResult, FeatureKey } from '../../features/calculator/calculator.types.js';
import { submitLead } from '../../utils/lead.js';
import { ExternalIcon } from '../../components/ui/Icons.js';

interface State {
  step: number;
  answers: CalculatorAnswers;
  result: CalculatorResult | null;
  error: string;
  status: string;
  submitting: boolean;
  sent: boolean;
}

export class Calculator extends React.Component<Record<string, never>, State> {
  state: State = {
    step: 0,
    answers: { features: [] },
    result: null,
    error: '',
    status: '',
    submitting: false,
    sent: false,
  };

  setField = (key: keyof CalculatorAnswers, value: string | boolean | FeatureKey[]): void => {
    this.setState(prev => ({ answers: { ...prev.answers, [key]: value } as CalculatorAnswers, error: '', status: '' }));
  };

  toggleFeature = (feature: FeatureKey): void => {
    this.setState(prev => {
      const has = prev.answers.features.includes(feature);
      const features = has ? prev.answers.features.filter(item => item !== feature) : [...prev.answers.features, feature];
      return { answers: { ...prev.answers, features }, error: '', status: '' };
    });
  };

  next = (): void => {
    const error = validateStep(this.state.step, this.state.answers);
    if (error) { this.setState({ error }); return; }
    if (this.state.step < calculatorSteps.length - 1) {
      this.setState(prev => ({ step: prev.step + 1, result: null, error: '', status: '' }));
      return;
    }
    this.setState({ result: calculateEstimate(this.state.answers), error: '', status: '' });
  };

  back = (): void => {
    if (this.state.result) {
      this.setState({ result: null, status: '', sent: false });
      return;
    }
    if (this.state.step > 0) this.setState(prev => ({ step: prev.step - 1, error: '', status: '' }));
  };

  submit = async (): Promise<void> => {
    if (!this.state.result || this.state.submitting || this.state.sent) return;
    this.setState({ submitting: true, status: '' });
    const result = await submitLead({
      form_type: 'Калькулятор',
      name: this.state.answers.calc_name || '',
      contact: this.state.answers.calc_contact || '',
      message: this.state.answers.calc_comment || '',
      calculator_result: this.state.result.range,
      calculator_answers: this.state.answers,
      source_cta: 'calculator_submit',
      consent: Boolean(this.state.answers.calc_consent),
      website: this.state.answers.website || '',
    });
    if (result.ok) this.setState({ submitting: false, sent: true, status: 'Расчёт отправлен. Я свяжусь с вами по указанному контакту.' });
    else this.setState({ submitting: false, status: result.error || 'Не удалось отправить расчёт.' });
  };

  renderOptions(): React.ReactElement {
    const current = calculatorSteps[this.state.step]!;
    if (current.type === 'contact') {
      return <div className="calculator-contact">
        <label><span>Имя *</span><input type="text" autoComplete="name" value={this.state.answers.calc_name || ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setField('calc_name', event.currentTarget.value)} /></label>
        <label><span>Telegram / телефон / email *</span><input type="text" autoComplete="off" value={this.state.answers.calc_contact || ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setField('calc_contact', event.currentTarget.value)} /></label>
        <label className="calculator-contact__wide"><span>Комментарий</span><textarea rows={3} value={this.state.answers.calc_comment || ''} placeholder="Коротко опишите нишу, задачу или ссылку на текущий сайт" onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => this.setField('calc_comment', event.currentTarget.value)} /></label>
        <label className="honeypot" aria-hidden="true"><span>Website</span><input type="text" tabIndex={-1} autoComplete="off" value={this.state.answers.website || ''} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setField('website', event.currentTarget.value)} /></label>
        <label className="consent-row calculator-contact__wide"><input type="checkbox" checked={Boolean(this.state.answers.calc_consent)} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setField('calc_consent', event.currentTarget.checked)} /><span>Я согласен на обработку персональных данных и ознакомлен с <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.</span></label>
      </div>;
    }

    return <div className="calculator-options">
      {(current.options || []).map(option => {
        const checked = current.type === 'checkbox'
          ? this.state.answers.features.includes(option.value as FeatureKey)
          : String(this.state.answers[current.key as keyof CalculatorAnswers] || '') === option.value;
        return <label className={`calculator-option${checked ? ' is-selected' : ''}`} key={option.value}>
          <input
            type={current.type === 'checkbox' ? 'checkbox' : 'radio'}
            name={String(current.key)}
            value={option.value}
            checked={checked}
            onChange={() => current.type === 'checkbox' ? this.toggleFeature(option.value as FeatureKey) : this.setField(current.key as keyof CalculatorAnswers, option.value)}
          />
          <span>{option.label}</span><i aria-hidden="true"></i>
        </label>;
      })}
    </div>;
  }

  renderResult(): React.ReactElement {
    const result = this.state.result as CalculatorResult;
    return <div className="calculator-result" aria-live="polite">
      <span className="label label--dark">ВАШ ОРИЕНТИР</span>
      <h3>{result.range.replace('Ориентировочная стоимость: ', '')}</h3>
      <p>Это предварительный диапазон по выбранным параметрам. Точную стоимость назову после короткого обсуждения задачи и материалов.</p>
      <div className="calculator-result__actions">
        <button className="calc-action calc-action--light" type="button" disabled={this.state.submitting || this.state.sent} onClick={this.submit}>{this.state.sent ? 'ОТПРАВЛЕНО' : this.state.submitting ? 'ОТПРАВКА…' : 'ОТПРАВИТЬ РАСЧЁТ'} <ExternalIcon /></button>
        <button className="calc-action calc-action--ghost" type="button" onClick={this.back}>ИЗМЕНИТЬ ОТВЕТЫ</button>
      </div>
      {this.state.status ? <p className={`form-message${this.state.sent ? ' is-success' : ''}`} aria-live="polite">{this.state.status}</p> : null}
    </div>;
  }

  render(): React.ReactElement {
    const current = calculatorSteps[this.state.step]!;
    const progress = ((this.state.step + 1) / calculatorSteps.length) * 100;
    return <section className="calculator-section section-dark" id="calculator" aria-labelledby="calculator-title">
      <div className="section-inner calculator-layout">
        <div className="calculator-intro">
          <span className="label label--dark">КАЛЬКУЛЯТОР</span>
          <h2 className="display-title display-title--light" id="calculator-title">РАССЧИТАЙТЕ<br/>СТОИМОСТЬ</h2>
          <p>7 коротких шагов дадут ориентир по бюджету. Цены и коэффициенты перенесены из текущего калькулятора без произвольных изменений.</p>
        </div>

        <div className="calculator-panel">
          <div className="calculator-panel__meta"><span>{String(this.state.step + 1).padStart(2, '0')} / {String(calculatorSteps.length).padStart(2, '0')}</span><span>ОРИЕНТИР ПО БЮДЖЕТУ</span></div>
          <div className="calculator-progress" aria-hidden="true"><i style={{ width: `${progress}%` }}></i></div>
          {this.state.result ? this.renderResult() : <div className="calculator-question">
            <h3>{current.title}</h3>
            {this.renderOptions()}
            {this.state.error ? <p className="field-error" role="alert">{this.state.error}</p> : null}
            <div className="calculator-nav">
              <button type="button" className="calc-action calc-action--ghost" disabled={this.state.step === 0} onClick={this.back}>НАЗАД</button>
              <button type="button" className="calc-action calc-action--light" onClick={this.next}>{this.state.step === calculatorSteps.length - 1 ? 'ПОКАЗАТЬ РАСЧЁТ' : 'ДАЛЕЕ'} <span aria-hidden="true">→</span></button>
            </div>
          </div>}
        </div>
      </div>
    </section>;
  }
}
