export interface ContactOpenDetail {
  source?: string;
  service?: string;
  message?: string;
}

export function openContact(detail: ContactOpenDetail = {}): void {
  window.dispatchEvent(new CustomEvent<ContactOpenDetail>('portfolio:contact-open', { detail }));
}
