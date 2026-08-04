export type AppType = 'paper-builder' | 'ai-tutor';

export interface AnalysisResult {
  question: string;
  subject: string;
  knowledgePoints: string[];
  answer: string;
  detailedSolution: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}
