import type { CalculatorStep } from './calculator.types.js';

export const calculatorSteps: CalculatorStep[] = [
  {
    key: 'task', type: 'radio', title: 'Что нужно сделать?', required: true,
    options: [
      { value: 'new', label: 'Новый лендинг под ключ' },
      { value: 'figma', label: 'Верстка по готовому дизайну' },
      { value: 'repair', label: 'Доработка существующего сайта' },
      { value: 'interactive', label: 'Отдельный интерактивный блок' },
    ],
  },
  {
    key: 'blocks', type: 'radio', title: 'Сколько примерно блоков будет на странице?', required: true,
    options: [
      { value: 'up5', label: 'До 5' },
      { value: '6-8', label: '6–8' },
      { value: '9-12', label: '9–12' },
      { value: '12+', label: '12+' },
      { value: 'unknown', label: 'Не знаю, нужна подсказка' },
    ],
  },
  {
    key: 'design', type: 'radio', title: 'Дизайн уже есть?', required: true,
    options: [
      { value: 'figma', label: 'Есть макет Figma' },
      { value: 'simple', label: 'Нужен простой дизайн по референсам' },
      { value: 'custom', label: 'Нужен индивидуальный стиль' },
      { value: 'only-code', label: 'Нужно только сверстать' },
    ],
  },
  {
    key: 'features', type: 'checkbox', title: 'Какие элементы нужны?', required: false,
    options: [
      { value: 'form', label: 'Форма заявки' },
      { value: 'popup', label: 'Pop-up' },
      { value: 'faq', label: 'FAQ' },
      { value: 'slider', label: 'Слайдер' },
      { value: 'tabs', label: 'Табы' },
      { value: 'calculator', label: 'Калькулятор' },
      { value: 'quiz', label: 'Квиз' },
      { value: 'animation', label: 'Анимации' },
      { value: 'filter', label: 'Фильтр кейсов' },
      { value: 'telegram', label: 'Интеграция с Telegram' },
    ],
  },
  {
    key: 'content', type: 'radio', title: 'Нужна ли помощь с текстами и структурой?', required: true,
    options: [
      { value: 'ready', label: 'Тексты готовы' },
      { value: 'structure', label: 'Нужна помощь со структурой' },
      { value: 'texts', label: 'Нужно подсказать тексты для блоков' },
      { value: 'materials', label: 'Нужно собрать контент из материалов' },
    ],
  },
  {
    key: 'deadline', type: 'radio', title: 'Когда хотите запустить сайт?', required: true,
    options: [
      { value: 'standard', label: 'Стандартный срок' },
      { value: 'fast', label: 'Нужно быстрее' },
      { value: 'discuss', label: 'Срок обсуждается' },
    ],
  },
  { key: 'contact', type: 'contact', title: 'Куда отправить расчёт?', required: true },
];

export const calculatorPricing = {
  estimateDiscount: 0.8,
  base: { new: 52000, figma: 32000, repair: 22000, interactive: 18000 },
  blocks: { up5: 0, '6-8': 11000, '9-12': 23000, '12+': 38000, unknown: 15000 },
  design: { figma: 0, simple: 15000, custom: 32000, 'only-code': 0 },
  feature: { form: 4500, popup: 3500, faq: 2500, slider: 5000, tabs: 3500, calculator: 12000, quiz: 13500, animation: 6500, filter: 6000, telegram: 7000 },
  content: { ready: 0, structure: 9000, texts: 12000, materials: 16000 },
  fastMultiplier: 1.2,
  highMultiplier: 1.28,
} as const;
