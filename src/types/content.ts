export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  format: string;
  url: string;
  image: string;
  alt: string;
}

export interface Service {
  index: string;
  title: string;
  description: string;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type ValueIcon = 'cursor' | 'detail' | 'target' | 'feedback' | 'chat' | 'responsive' | 'support';

export interface ValueItem {
  label: string;
  text: string;
  icon: ValueIcon;
}
