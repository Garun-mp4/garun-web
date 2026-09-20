# Garun Portfolio — redesign

Production frontend-проект персонального портфолио. Сайт полностью пересобран на React + TypeScript + Vite в визуальном языке референса Grigoletti, но использует только собственный контент, проекты, фотографии, ссылки и бизнес-логику.

## Requirements

- Node.js 20.19+ или 22.12+ (рекомендуется актуальный Node 22 LTS)
- npm 10+

Проверить версии:

```bash
node -v
npm -v
```

## Installation

Обычная установка:

```bash
npm install
```

Если до замены проекта уже была неудачная установка старой версии, безопаснее сначала удалить её частичные артефакты в PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache verify
npm install
```

Не используйте `--force` или `--legacy-peer-deps`: в исправленной версии они не нужны.

### Исправление конфликта TypeScript / ESLint

Если до этого `npm install` уже завершался с `ERESOLVE`, проще распаковать этот новый архив в чистую папку. Если вы заменяете файлы поверх старой папки, удалите старые `node_modules` и `package-lock.json` перед повторной установкой.

В предыдущей сборке был ошибочно указан `typescript@7.0.2`, тогда как `typescript-eslint@8.70.0` принимает TypeScript только в диапазоне `>=4.8.4 <6.1.0`. Поэтому npm корректно останавливал установку с `ERESOLVE`.

В этой версии TypeScript зафиксирован на `5.9.2`, а основные tooling-зависимости также закреплены точными версиями. Это устраняет исходный peer-dependency conflict и уменьшает риск внезапного несовместимого апдейта при новой установке. Диапазон Node.js приведён к официальному требованию Vite 8: `20.19+` или `22.12+`.

## Development

```bash
npm run dev
```

Vite выведет локальный URL в терминале, обычно `http://localhost:5173`.

Основные страницы:

- `/` — главная с hero, featured-проектами, услугами, About, FAQ и CTA;
- `/services` — полная страница услуг;
- `/projects` — полный список проектов;
- `/about` — страница «Обо мне»;
- `/contact` — контактная форма;
- `/calculator` — отдельный калькулятор оценки проекта.

## Production build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Quality checks

Быстрая проверка структуры проекта без установки дополнительных браузеров:

```bash
npm run verify
```

Основной набор проверок:

```bash
npm run check
```

`npm run check` последовательно выполняет static verification, ESLint, Vitest и production build.

Playwright smoke-тесты запускаются отдельно:

```bash
npx playwright install chromium
npm run test:e2e
```

Unit-тесты проверяют формулы калькулятора и обязательную валидацию. Playwright smoke-тесты проверяют загрузку главной, Services dropdown, FAQ, все семь шагов калькулятора, mobile menu, contact page, project links и reduced-motion behavior.

## Environment variables

Скопируйте `.env.example` в локальный файл окружения или задайте переменные в Vercel:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_MESSAGE_THREAD_ID=
```

`TELEGRAM_MESSAGE_THREAD_ID` необязателен. Никогда не добавляйте реальные секреты в Git.

## Telegram setup

Serverless function находится в `api/send-lead.js`. Frontend отправляет заявки на `/api/send-lead`, как ожидается для Vercel Functions. Endpoint:

- принимает только POST/OPTIONS;
- требует имя, контакт и согласие;
- использует honeypot против простого bot-spam;
- передаёт current URL, referrer, UTM и данные калькулятора;
- не передаёт IP посетителя в Telegram;
- имеет timeout и отдельную обработку сетевой ошибки Telegram;
- не содержит токенов или chat ID во frontend/source.

При локальном запуске через чистый `npm run dev` Vercel Function не исполняется. Для полноценной локальной проверки отправки используйте Vercel CLI / Vercel Preview либо задеплойте preview deployment.

## Vercel deployment

1. Импортируйте репозиторий в Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Добавьте Telegram environment variables.
6. Deploy.

`vercel.json` отдаёт все клиентские маршруты через SPA fallback и не переписывает существующие `/api/*` и статические файлы. Политика конфиденциальности публикуется как `/privacy` (исходный файл — `privacy.html`) и использует тот же Lenis runtime, что и основное приложение. Внутренние ссылки и metadata не привязаны к конкретному домену.

## Structure

```text
api/                     Vercel serverless Telegram endpoint
public/                  favicon, logo, case screenshots, portrait, privacy assets
scripts/                 dependency/assets/static verification
src/
  app/                   App composition
  components/            layout and reusable UI
  data/                  typed services/projects/FAQ/values
  features/
    calculator/          config, types and pure pricing logic
    contact/             contact overlay
    cursor/              contextual custom cursor
  sections/              Hero, Services, Projects, About, Values, Calculator, FAQ, CTA, Footer, Contact
  styles/                design tokens, typography, global component styles
  utils/                 lead submission and contact events
tests/                   Vitest unit tests
e2e/                     Playwright smoke tests
```

## Fonts

Референс использует коммерческие PP Neue Corp Tight / PP Neue Montreal / PP Neue Montreal Mono. Их лицензированные бинарники не входили в предоставленный проект, поэтому репозиторий не копирует и не hotlink-ит эти proprietary font files с чужого сайта. Сейчас используются легальные web-font fallbacks: Oswald, Inter и Roboto Mono, плюс системные condensed fallbacks для display-текста.

Токены уже используют имена PP Neue первыми в font stack, поэтому собственные лицензированные WOFF2-файлы можно подключить без изменения компонентов через `src/styles/tokens.css` / `src/styles/typography.css`.

## Calculator note

Вопросы, варианты ответов, цены, коэффициенты, discount, fast multiplier и формула диапазона перенесены из актуальной legacy-версии калькулятора без произвольного изменения pricing model. Калькулятор доступен на отдельном `/calculator`, чтобы главная страница сохраняла компактную editorial-структуру референса. Отдельная presentation-классификация `Старт / Бизнес / Продажи+` в новой IA не используется; ориентировочный диапазон стоимости и отправка расчёта сохранены.
