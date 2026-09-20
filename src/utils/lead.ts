export interface LeadPayload {
  form_type: string;
  name: string;
  contact: string;
  message?: string;
  service_type?: string;
  calculator_result?: string;
  calculator_answers?: unknown;
  source_cta?: string;
  consent: boolean;
  website?: string;
}

export interface SubmitResult { ok: boolean; error?: string; }

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  const url = new URL(window.location.href);
  const enriched = {
    ...payload,
    current_url: window.location.href,
    referrer: document.referrer,
    utm_source: url.searchParams.get('utm_source') || '',
    utm_medium: url.searchParams.get('utm_medium') || '',
    utm_campaign: url.searchParams.get('utm_campaign') || '',
    timestamp: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch('/api/send-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enriched),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, error: data.error || 'Не удалось отправить заявку.' };
    return { ok: true };
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'AbortError';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return {
      ok: false,
      error: timedOut
        ? 'Сервер не ответил вовремя. Попробуйте ещё раз или напишите в Telegram.'
        : isLocal
          ? 'Локальный Vite-сервер не запускает Vercel API. Проверьте отправку через Vercel Preview или напишите в Telegram.'
          : 'Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram.',
    };
  } finally {
    window.clearTimeout(timer);
  }
}
