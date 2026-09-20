import { describe, expect, it } from 'vitest';
import { calculateEstimate, roundToThousand, validateStep } from '../src/features/calculator/calculator.logic.js';
import type { CalculatorAnswers } from '../src/features/calculator/calculator.types.js';

describe('calculator pricing', () => {
  it('preserves the legacy base calculation and discount', () => {
    const answers: CalculatorAnswers = {
      task: 'new',
      blocks: 'up5',
      design: 'figma',
      features: [],
      content: 'ready',
      deadline: 'standard',
    };
    const result = calculateEstimate(answers);
    expect(result.low).toBe(41_600);
    expect(result.high).toBeCloseTo(53_248);
    expect(result.range).toContain('42');
    expect(result.range).toContain('53');
  });

  it('applies feature additions and fast multiplier', () => {
    const answers: CalculatorAnswers = {
      task: 'figma',
      blocks: '6-8',
      design: 'simple',
      features: ['calculator', 'telegram'],
      content: 'structure',
      deadline: 'fast',
    };
    const result = calculateEstimate(answers);
    expect(result.low).toBeCloseTo(82_560);
    expect(result.high).toBeCloseTo(105_676.8);
  });

  it('rounds only the displayed estimate to the nearest thousand', () => {
    expect(roundToThousand(41_600)).toBe(42_000);
    expect(roundToThousand(53_248)).toBe(53_000);
  });
});

describe('calculator validation', () => {
  it('requires the mandatory choice steps', () => {
    const answers: CalculatorAnswers = { features: [] };
    expect(validateStep(0, answers)).toBeTruthy();
    answers.task = 'new';
    expect(validateStep(0, answers)).toBeNull();
  });

  it('requires contact data and consent on the final step', () => {
    const answers: CalculatorAnswers = { features: [], calc_name: 'Гарун', calc_contact: '@garun_web' };
    expect(validateStep(6, answers)).toContain('согласие');
    answers.calc_consent = true;
    expect(validateStep(6, answers)).toBeNull();
  });
});
