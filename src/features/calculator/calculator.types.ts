export type TaskKey = 'new' | 'figma' | 'repair' | 'interactive';
export type BlocksKey = 'up5' | '6-8' | '9-12' | '12+' | 'unknown';
export type DesignKey = 'figma' | 'simple' | 'custom' | 'only-code';
export type FeatureKey = 'form' | 'popup' | 'faq' | 'slider' | 'tabs' | 'calculator' | 'quiz' | 'animation' | 'filter' | 'telegram';
export type ContentKey = 'ready' | 'structure' | 'texts' | 'materials';
export type DeadlineKey = 'standard' | 'fast' | 'discuss';

export interface CalculatorAnswers {
  task?: TaskKey;
  blocks?: BlocksKey;
  design?: DesignKey;
  features: FeatureKey[];
  content?: ContentKey;
  deadline?: DeadlineKey;
  calc_name?: string;
  calc_contact?: string;
  calc_comment?: string;
  calc_consent?: boolean;
  website?: string;
}

export interface CalculatorResult {
  low: number;
  high: number;
  range: string;
}

export interface CalculatorOption<T extends string = string> {
  value: T;
  label: string;
}

export interface CalculatorStep {
  key: keyof CalculatorAnswers | 'contact';
  type: 'radio' | 'checkbox' | 'contact';
  title: string;
  required: boolean;
  options?: CalculatorOption[];
}
