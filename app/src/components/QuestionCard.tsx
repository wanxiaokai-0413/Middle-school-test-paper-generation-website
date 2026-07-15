import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Question } from '@/types/question';
import { difficulties, questionTypes } from '@/data/mockQuestions';
import { GripVertical, HelpCircle, Calculator, FileText, CheckSquare, Edit3 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: question.id,
    data: { question, source: 'bank', index },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.05)`,
    zIndex: 1000,
  } : undefined;

  const difficulty = difficulties.find(d => d.value === question.difficulty);
  const qType = questionTypes.find(t => t.value === question.type);

  const getTypeIcon = () => {
    switch (question.type) {
      case 'single':
      case 'multiple':
        return <CheckSquare className="w-4 h-4" />;
      case 'fill':
        return <Edit3 className="w-4 h-4" />;
      case 'calculation':
        return <Calculator className="w-4 h-4" />;
      case 'essay':
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group cursor-grab active:cursor-grabbing
        bg-white rounded-xl border-2 transition-all duration-300
        ${isDragging ? 'shadow-2xl border-[#00796b] ring-4 ring-[#00796b]/20' : 'shadow-sm border-gray-200 hover:border-[#00796b]/50 hover:shadow-lg'}
        ${isExpanded ? 'p-4' : 'p-3'}
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      {...attributes}
      {...listeners}
    >
      {/* 拖拽手柄 */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className={`${isDragging ? 'pl-0' : 'pl-0'} transition-all`}>
        {/* 头部信息 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#00796b]/10 flex items-center justify-center text-[#00796b] text-xs font-semibold">
              {getTypeIcon()}
            </span>
            <h4 className="font-medium text-gray-800 text-sm truncate flex-1">
              {question.title}
            </h4>
          </div>
          <span 
            className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: `${difficulty?.color}20`,
              color: difficulty?.color 
            }}
          >
            {difficulty?.label}
          </span>
        </div>

        {/* 展开内容 */}
        <div className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}
        `}>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {question.content}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {qType?.label}
              </span>
              <span>默认分值: {question.defaultScore}分</span>
            </div>
            {question.knowledgePoint && (
              <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                {question.knowledgePoint}
              </span>
            )}
          </div>
        </div>

        {/* 收缩状态显示 */}
        {!isExpanded && (
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>{qType?.label}</span>
            <span>·</span>
            <span>{question.defaultScore}分</span>
          </div>
        )}
      </div>

      {/* 拖拽时的发光效果 */}
      {isDragging && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00796b]/10 to-[#ffc107]/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
