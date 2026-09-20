import React from 'react';
import type { ContactOpenDetail } from '../../utils/contact.js';
import { submitLead } from '../../utils/lead.js';

interface State {
  open: boolean;
  source: string;
  service: string;
  name: string;
  contact: string;
  message: string;
  consent: boolean;
  website: string;
  error: string;
  status: string;
  submitting: boolean;
  sent: boolean;
}

export class ContactModal extends React.Component<Record<string, never>, State> {
  state: State = { open: false, source: '', service: '', name: '', contact: '', message: '', consent: false, website: '', error: '', status: '', submitting: false, sent: false };
  private dialogRef = React.createRef<HTMLDivElement>();
  private previousActive: HTMLElement | null = null;

  componentDidMount(): void {
    window.addEventListener('portfolio:contact-open', this.onOpen as EventListener);
    document.addEventListener('keydown', this.onKeydown);
  }

  componentWillUnmount(): void {
    window.removeEventListener('portfolio:contact-open', this.onOpen as EventListener);
    document.removeEventListener('keydown', this.onKeydown);
    document.body.classList.remove('modal-open');
  }

  onOpen = (event: CustomEvent<ContactOpenDetail>): void => {
    this.previousActive = document.activeElement as HTMLElement;
    const detail = event.detail || {};
    this.setState({ open: true, source: detail.source || '', service: detail.service || '', message: detail.message || '', error: '', status: '', submitting: false, sent: false }, () => {
      document.body.classList.add('modal-open');
      window.setTimeout(() => this.dialogRef.current?.querySelector<HTMLElement>('input:not([tabindex="-1"]), textarea, button')?.focus(), 0);
    });
  };

  onKeydown = (event: KeyboardEvent): void => {
    if (!this.state.open) return;
    if (event.key === 'Escape') { this.close(); return; }
    if (event.key !== 'Tab' || !this.dialogRef.current) return;

    const focusable = Array.from(this.dialogRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])',
    )).filter(element => element.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  close = (): void => {
    this.setState({ open: false, error: '', status: '' }, () => {
      document.body.classList.remove('modal-open');
      this.previousActive?.focus();
    });
  };

  submit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (this.state.submitting) return;
    if (!this.state.name.trim() || !this.state.contact.trim()) { this.setState({ error: 'Укажите имя и контакт.' }); return; }
    if (!this.state.consent) { this.setState({ error: 'Нужно согласие с Политикой конфиденциальности.' }); return; }
    this.setState({ submitting: true, error: '', status: '' });
    const result = await submitLead({
      form_type: 'Заявка', name: this.state.name, contact: this.state.contact, message: this.state.message,
      service_type: this.state.service, source_cta: this.state.source || 'contact_modal', consent: this.state.consent, website: this.state.website,
    });
    if (result.ok) this.setState({ submitting: false, sent: true, status: 'Заявка отправлена. Я свяжусь с вами по указанному контакту.' });
    else this.setState({ submitting: false, status: result.error || 'Не удалось отправить заявку.' });
  };

  render(): React.ReactElement | null {
    if (!this.state.open) return null;
    return <div className="contact-modal" role="presentation">
      <button className="contact-modal__backdrop" type="button" tabIndex={-1} aria-label="Закрыть форму" onClick={this.close}></button>
      <div className="contact-modal__dialog" ref={this.dialogRef} role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title" data-lenis-prevent>
        <div className="contact-modal__head">
          <span className="label">ЗАЯВКА</span>
          <button type="button" className="contact-modal__close" onClick={this.close} aria-label="Закрыть форму">×</button>
        </div>
        <h2 id="contact-dialog-title">РАССКАЖИТЕ<br/>О ЗАДАЧЕ</h2>
        <p>Можно коротко: что за бизнес, какой сайт нужен и есть ли текущая страница или референс.</p>
        <form onSubmit={this.submit} noValidate>
          <label><span>Имя *</span><input type="text" autoComplete="name" value={this.state.name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({ name: event.currentTarget.value, error: '' })} /></label>
          <label><span>Telegram / телефон / email *</span><input type="text" autoComplete="off" value={this.state.contact} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({ contact: event.currentTarget.value, error: '' })} /></label>
          <label><span>Коротко о задаче</span><textarea rows={4} value={this.state.message} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({ message: event.currentTarget.value })} /></label>
          <label className="honeypot" aria-hidden="true"><span>Website</span><input type="text" tabIndex={-1} autoComplete="off" value={this.state.website} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({ website: event.currentTarget.value })} /></label>
          <label className="consent-row"><input type="checkbox" checked={this.state.consent} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this.setState({ consent: event.currentTarget.checked, error: '' })} /><span>Я согласен на обработку персональных данных и ознакомлен с <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Политикой конфиденциальности</a>.</span></label>
          {this.state.error ? <p className="field-error" role="alert">{this.state.error}</p> : null}
          {this.state.status ? <p className={`form-message${this.state.sent ? ' is-success' : ''}`} aria-live="polite">{this.state.status}</p> : null}
          <button className="contact-submit" type="submit" disabled={this.state.submitting || this.state.sent}>{this.state.sent ? 'ОТПРАВЛЕНО' : this.state.submitting ? 'ОТПРАВКА…' : 'ОТПРАВИТЬ ЗАЯВКУ'}</button>
        </form>
        <a className="contact-modal__telegram" href="https://t.me/garun_web" target="_blank" rel="noopener noreferrer">Или написать напрямую в Telegram ↗</a>
      </div>
    </div>;
  }
}
