// 应用类型
export type AppType = 'paper-builder' | 'ai-tutor' | 'avatar-editor';

// 应用信息
export interface AppInfo {
  id: AppType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// AI解题状态
export interface AITutorState {
  inputMethod: 'text' | 'image' | 'voice';
  question: string;
  questionImage: string | null;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  isGeneratingVideo: boolean;
  generatedVideo: VideoResult | null;
}

// 分析结果
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

// 视频结果
export interface VideoResult {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  avatarId: string;
  createdAt: Date;
}

// 虚拟形象
export interface Avatar {
  id: string;
  name: string;
  thumbnail: string;
  config: AvatarConfig;
  isDefault: boolean;
}

// 虚拟形象配置
export interface AvatarConfig {
  // 基础外观
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  eyeColor: string;
  // 服装
  outfit: string;
  outfitColor: string;
  // 配饰
  glasses: boolean;
  hat: boolean;
  // 动画风格
  animationStyle: 'lively' | 'calm' | 'professional' | 'cute';
  // 语音
  voice: string;
  speechRate: number;
}

// 视频生成配置
export interface VideoConfig {
  avatarId: string;
  background: string;
  subtitleEnabled: boolean;
  highlightFormulas: boolean;
  explanationSpeed: 'slow' | 'normal' | 'fast';
  showStepByStep: boolean;
}
