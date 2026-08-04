import { useState } from 'react';
import type { AnalysisResult as AnalysisResultType } from '@/types/app';
import { 
  BookOpen, 
  Lightbulb, 
  Clock, 
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    solution: true,
    tips: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 头部信息 */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">AI解题分析</h3>
            <p className="text-purple-100 text-sm mt-1">{result.subject} · {result.knowledgePoints.join('、')}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(result.difficulty)}`}>
              {getDifficultyLabel(result.difficulty)}
            </span>
            <span className="flex items-center gap-1 text-sm text-purple-100">
              <Clock className="w-4 h-4" />
              {result.estimatedTime}分钟
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 题目 */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            题目
          </h4>
          <div className="bg-gray-50 rounded-xl p-4 text-gray-800">
            {result.question}
          </div>
        </div>

        {/* 答案 */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            答案
          </h4>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 font-medium">
            {result.answer}
          </div>
        </div>

        {/* 详细解析 */}
        <div>
          <button
            onClick={() => toggleSection('solution')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-500 mb-2 hover:text-gray-700"
          >
            <span className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              详细解析
            </span>
            {expandedSections.solution ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.solution && (
            <div className="bg-gray-50 rounded-xl p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result.detailedSolution}
            </div>
          )}
        </div>

        {/* 知识点 */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">涉及知识点</h4>
          <div className="flex flex-wrap gap-2">
            {result.knowledgePoints.map((point, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
              >
                {point}
              </span>
            ))}
          </div>
        </div>

        {/* 学习提示 */}
        <div>
          <button
            onClick={() => toggleSection('tips')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-500 mb-2 hover:text-gray-700"
          >
            <span className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              学习提示
            </span>
            {expandedSections.tips ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.tips && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-yellow-800">
                    <span className="w-5 h-5 bg-yellow-200 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
