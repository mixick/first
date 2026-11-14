export interface Formula {
  name: string;
  expression: string;
  meaning: string;
}

export interface SolutionStep {
  title: string;
  text: string;
}

export interface FollowUp {
  question: string;
  answer: string;
  keywords: string[];
}

export interface Practice {
  question: string;
  answer: number;
  unit: string;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  keywords: string[];
  summary: string;
  explanation: string[];
  formulas: Formula[];
  dailyExample: string;
  problem: string;
  steps: SolutionStep[];
  practice: Practice;
  followUps: FollowUp[];
}
