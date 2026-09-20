import { calculatorPricing } from './calculator.config.js';
import type { CalculatorAnswers, CalculatorResult, FeatureKey } from './calculator.types.js';

export function roundToThousand(value: number): number {
  return Math.round(value / 1000) * 1000;
}

export function formatRub(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(roundToThousand(value));
}

export function calculateEstimate(answers: CalculatorAnswers): CalculatorResult {
  const pricing = calculatorPricing;
  const base = answers.task ? pricing.base[answers.task] : 42000;
  const blocks = answers.blocks ? pricing.blocks[answers.blocks] : 0;
  const design = answers.design ? pricing.design[answers.design] : 0;
  const features = (answers.features || []).reduce((sum, key: FeatureKey) => sum + pricing.feature[key], 0);
  const content = answers.content ? pricing.content[answers.content] : 0;
  const urgency = answers.deadline === 'fast' ? pricing.fastMultiplier : 1;
  const low = (base + blocks + design + features + content) * urgency * pricing.estimateDiscount;
  const high = low * pricing.highMultiplier;

  return {
    low,
    high,
    range: `Ориентировочная стоимость: ${formatRub(low)}–${formatRub(high)} ₽`,
  };
}

export function validateStep(stepIndex: number, answers: CalculatorAnswers): string | null {
  switch (stepIndex) {
    case 0: return answers.task ? null : 'Выберите тип задачи.';
    case 1: return answers.blocks ? null : 'Выберите примерный объём страницы.';
    case 2: return answers.design ? null : 'Укажите, есть ли готовый дизайн.';
    case 3: return null;
    case 4: return answers.content ? null : 'Выберите вариант по текстам и структуре.';
    case 5: return answers.deadline ? null : 'Выберите желаемый срок.';
    case 6:
      if (!answers.calc_name?.trim() || !answers.calc_contact?.trim()) return 'Укажите имя и контакт.';
      if (!answers.calc_consent) return 'Нужно согласие с Политикой конфиденциальности.';
      return null;
    default: return null;
  }
}
