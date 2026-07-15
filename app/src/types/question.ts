// 题目类型
export type QuestionType = 'single' | 'multiple' | 'fill' | 'essay' | 'calculation';

// 难度级别
export type Difficulty = 'easy' | 'medium' | 'hard';

// 科目
export type Subject = 'math' | 'chinese' | 'english' | 'physics' | 'chemistry' | 'biology' | 'history' | 'geography' | 'politics';

// 年级
export type Grade = 'grade7' | 'grade8' | 'grade9' | 'grade10' | 'grade11' | 'grade12';

// 题目接口
export interface Question {
  id: string;
  title: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  subject: Subject;
  grade: Grade;
  defaultScore: number;
  options?: string[]; // 选择题选项
  answer?: string;
  knowledgePoint?: string;
}

// 试卷中的题目
export interface PaperQuestion extends Question {
  paperId: string;
  orderNumber: number;
  score: number;
}

// 试卷设置
export interface PaperSettings {
  title: string;
  subtitle: string;
  examTime: number; // 分钟
  totalScore: number;
  instructions: string;
}

// 筛选条件
export interface FilterCriteria {
  grade: Grade | 'all';
  subject: Subject | 'all';
  difficulty: Difficulty | 'all';
  type: QuestionType | 'all';
}

// 拖拽状态
export interface DragState {
  isDragging: boolean;
  draggedItem: Question | null;
  sourceIndex: number | null;
}
