# Final report

## Исправление `npm install`

Причина ошибки `ERESOLVE` была в несовместимой паре зависимостей:

- проект требовал `typescript@7.0.2`;
- `typescript-eslint@8.70.0` поддерживает TypeScript только `>=4.8.4 <6.1.0`.

Исправлено:

- TypeScript закреплён на `5.9.2`;
- React / React DOM и их type definitions синхронизированы на ветке `19.3.0`;
- tooling-зависимости закреплены точными версиями вместо диапазонов `^`;
- добавлен `packageManager: npm@10.9.2`;
- добавлен `npm run verify` и общий `npm run check`.

`--force` и `--legacy-peer-deps` не требуются и не рекомендуются.

## Дополнительные исправления после аудита

- Исправлено обрезание длинных русских подписей в layer-swap CTA-кнопках: ширина теперь рассчитывается по фактическому содержимому, включая portrait thumbnail.
- Calculator contact field больше не притворяется email-only полем: autocomplete отключён, потому что поле принимает Telegram / телефон / email.
- В калькулятор добавлен honeypot, который передаётся тем же безопасным путём, что и в основной форме.
- Для скрытых radio/checkbox options добавлено заметное keyboard focus состояние.
- Calculator result/status использует live-region для screen readers.
- Contact modal сбрасывает stale submitting/sent state при новом открытии, блокирует повторную отправку и сохраняет focus trap / возврат фокуса.
- Telegram endpoint устойчиво обрабатывает object body и JSON-string body, invalid JSON, timeout и network failures.
- `TELEGRAM_MESSAGE_THREAD_ID` применяется только если это положительное safe integer.
- Honeypot и consent не попадают в текст calculator answers.
- IP посетителя больше не пересылается в Telegram — это уменьшает лишнюю передачу персональных данных и устраняет несоответствие с формой/Privacy UX.
- Responsive case images проверены: для всех девяти проектов существуют full + `-700.webp` версии.
- Расширены Playwright smoke-тесты: dropdown, FAQ, 9 project links, modal, все семь шагов calculator, mobile menu и reduced motion.

## Что переработано в редизайне

- Legacy HTML/CSS/JS пересобран как React + TypeScript + Vite проект.
- IA: Header → Hero → Services → Projects → About → Values → Calculator → FAQ → CTA → Footer.
- Реализованы reference-like sticky Services, row-based Projects, contextual custom cursor, sticky/scale About, scroll-active Values, ruled FAQ, compact contact overlay и viewport CTA.
- Fixed header адаптирует logo/contact control над тёмными секциями.
- Все 9 реальных проектов и внешние ссылки сохранены.
- Основной portrait использует существующий `hero-img-soft`.
- Case screenshots конвертированы в WebP и имеют responsive варианты.
- Добавлены SEO/OG/Twitter metadata, favicon set, semantic headings и accessibility states.

## Сохранённая функциональность

- 7-шаговый калькулятор и исходная pricing model: base prices, block/design/content additions, feature coefficients, discount, fast multiplier и high multiplier.
- Calculator result + calculator answers в lead payload.
- Telegram Vercel Function `/api/send-lead`.
- Honeypot, consent, UTM/referrer/current URL.
- Privacy Policy.
- Реальные project links, Telegram и GitHub.
- Mobile navigation, keyboard/focus states и `prefers-reduced-motion`.

## Stack

- React 19.3.0
- TypeScript 5.9.2
- Vite 8.3.0
- Custom CSS + CSS variables/tokens
- ESLint 10.11.0 + typescript-eslint 8.70.0
- Vitest 5.0.1
- Playwright 1.63.0
- Vercel serverless function для Telegram

## QA, выполненный в текущей среде

Успешно выполнены:

- static verification dependency pins / required files / local assets / 9 project URLs / env placeholders / API privacy;
- syntax transpile всех 28 TS/TSX source/test файлов через TypeScript compiler API;
- strict semantic type-check pure TypeScript modules: content/data/calculator/utils;
- executable calculator smoke-check с реальными assertions для base calculation, feature additions, fast multiplier, rounding и final-step validation;
- executable serverless API smoke-check с mocked Telegram `fetch`: GET 405, honeypot skip, consent validation, JSON-string body, invalid JSON, successful Telegram payload, invalid thread id, calculator-answer sanitization и network failure 502;
- `node --check api/send-lead.js`;
- CSS parse-check для tokens/typography/global/privacy styles;
- HTML metadata/structure check для `index.html` и Privacy;
- decode/dimension check всех WebP case images и portrait;
- scan на TODO/FIXME/HACK, explicit `any`, browser `alert`, hard-coded secrets — проблем не найдено;
- asset-size audit: весь `public/` меньше 1 MB, case media оптимизированы.

### Проверка npm dependency resolution

После замены TypeScript исходный peer-конфликт устранён по совместимому диапазону `typescript-eslint`. Попытка `npm install` в sandbox больше не завершилась `ERESOLVE`; процесс упёрся в недоступность npm registry и был остановлен по timeout.

Из-за отсутствия стабильного исходящего доступа к `registry.npmjs.org` в этой среде невозможно честно завершить installation-dependent команды `npm run build`, `npm run lint`, `npm run test` и `npm run test:e2e` с локально установленными node_modules. На обычном ПК с интернетом после распаковки нужно выполнить:

```bash
npm install
npm run check
npx playwright install chromium
npm run test:e2e
```

## Fonts / pixel fidelity

Оригинальные PP Neue font binaries не были законно предоставлены, поэтому они не включены и не hotlink-ятся с reference. Используются licensing-safe fallbacks: Oswald / Inter / Roboto Mono + system fallbacks.

Это единственное известное визуальное ограничение относительно максимально точной типографической копии reference: для полного совпадения метрик нужны собственные лицензированные PP Neue WOFF2.


## Дополнительно в финальном проходе

- Исправлена начальная позиция custom cursor: он больше не появляется обрезанным квадратом в левом верхнем углу до первого движения мыши.
- Укреплена геометрия двухслойных CTA-кнопок: ширина теперь определяется реальным содержимым, чтобы русские подписи не обрезались на desktop/mobile.
- Устранён потенциальный ESLint error в `api/send-lead.js` из-за неиспользуемого параметра.
- Playwright e2e-файлы добавлены в TypeScript project check.
- Диапазон Node.js приведён к официальной совместимости Vite 8.
