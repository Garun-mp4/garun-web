import React from 'react';
import { submitLead } from '../../utils/lead.js';

interface FormState {
  name: string;
  contact: string;
  website: string;
  honeypot: string;
  message: string;
  consent: boolean;
}

export function ContactPage(): React.ReactElement {
  const [form, setForm] = React.useState<FormState>({ name: '', contact: '', website: '', message: '', consent: false, honeypot: '' });
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const update = (key: keyof FormState, value: string | boolean): void => {
    setForm(previous => ({ ...previous, [key]: value }));
    setError('');
    setStatus('');
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setError('Укажите имя и контакт.');
      return;
    }
    if (!form.consent) {
      setError('Нужно согласие с Политикой конфиденциальности.');
      return;
    }
    if (form.honeypot) {
      setSent(true);
      setStatus('Спасибо. Сообщение принято.');
      return;
    }

    setSubmitting(true);
    setError('');
    setStatus('');
    const result = await submitLead({
      form_type: 'Заявка со страницы контактов',
      name: form.name,
      contact: form.contact,
      message: form.message,
      source_cta: 'contact_page',
      consent: form.consent,
      website: form.website,
    });
    setSubmitting(false);
    if (result.ok) {
      setSent(true);
      setStatus('Заявка отправлена. Я свяжусь с вами по указанному контакту.');
    } else {
      setStatus(result.error || 'Не удалось отправить заявку.');
    }
  };

  return <section className="contact-page section-light" aria-labelledby="contact-page-title">
    <div className="section-inner contact-page__layout">
      <div className="contact-page__intro">
        <span className="label">КОНТАКТЫ</span>
        <h1 className="display-title" id="contact-page-title">РАССКАЖИТЕ<br/>О ЗАДАЧЕ</h1>
        <p>Опишите, что нужно сделать, и я вернусь с понятным следующим шагом. Можно начать с пары предложений и ссылки на текущий сайт.</p>
        <a className="plain-action plain-action--dark" href="https://t.me/garun_web" target="_blank" rel="noopener noreferrer">НАПИСАТЬ В TELEGRAM <span aria-hidden="true">↗</span></a>
      </div>

      <div className="contact-page__form-wrap">
        <div className="contact-page__form-meta"><span>ЗАЯВКА</span><span>ОТВЕЧУ ЛИЧНО</span></div>
        <form className="contact-page__form" onSubmit={submit} noValidate>
          <label><span>Имя *</span><input type="text" autoComplete="name" value={form.name} onChange={event => update('name', event.currentTarget.value)} /></label>
          <label><span>Telegram / телефон / email *</span><input type="text" autoComplete="off" value={form.contact} onChange={event => update('contact', event.currentTarget.value)} /></label>
          <label><span>Сайт</span><input type="url" autoComplete="url" value={form.website} onChange={event => update('website', event.currentTarget.value)} /></label>
          <label className="contact-page__form-wide"><span>Сообщение</span><textarea rows={5} value={form.message} placeholder="Коротко опишите нишу, задачу или ссылку на референс" onChange={event => update('message', event.currentTarget.value)} /></label>
          <label className="honeypot" aria-hidden="true"><span>Website</span><input tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={event => update('honeypot', event.currentTarget.value)} /></label>
          <label className="consent-row contact-page__form-wide"><input type="checkbox" checked={form.consent} onChange={event => update('consent', event.currentTarget.checked)} /><span>Я согласен на обработку персональных данных и ознакомлен с <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.</span></label>
          {error ? <p className="field-error" role="alert">{error}</p> : null}
          {status ? <p className={`form-message${sent ? ' is-success' : ''}`} aria-live="polite">{status}</p> : null}
          <button className="contact-page__submit" type="submit" disabled={submitting || sent}>{sent ? 'ОТПРАВЛЕНО' : submitting ? 'ОТПРАВКА…' : 'ОТПРАВИТЬ ЗАЯВКУ'} <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </div>
  </section>;
}
