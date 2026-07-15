import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PaperQuestion } from '@/types/question';
import { questionTypes } from '@/data/mockQuestions';
import { GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PaperQuestionItemProps {
  question: PaperQuestion;
  onRemove: (id: string) => void;
  onScoreChange: (id: string, score: number) => void;
}

export function PaperQuestionItem({ question, onRemove, onScoreChange }: PaperQuestionItemProps) {
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [tempScore, setTempScore] = useState(question.score);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.paperId,
    data: { question, source: 'paper' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  const qType = questionTypes.find(t => t.value === question.type);

  const handleScoreSave = () => {
    if (tempScore > 0) {
      onScoreChange(question.paperId, tempScore);
    }
    setIsEditingScore(false);
  };

  const handleScoreCancel = () => {
    setTempScore(question.score);
    setIsEditingScore(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white rounded-lg border-2 transition-all duration-200
        ${isDragging 
          ? 'shadow-2xl border-[#00796b] ring-4 ring-[#00796b]/20 scale-105' 
          : 'shadow-sm border-gray-200 hover:border-[#00796b]/30 hover:shadow-md'
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* 拖拽手柄和题号 */}
          <div 
            className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="w-8 h-8 rounded-full bg-[#00796b] text-white flex items-center justify-center text-sm font-bold">
              {question.orderNumber}
            </span>
          </div>

          {/* 题目内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-gray-800 text-sm">
                  {question.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {qType?.label} · {question.knowledgePoint}
                </p>
              </div>

              {/* 分值和操作 */}
              <div className="flex items-center gap-2">
                {/* 分值编辑 */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">分值:</span>
                  {isEditingScore ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={tempScore}
                        onChange={(e) => setTempScore(Number(e.target.value))}
                        className="w-14 h-7 text-xs"
                        min={1}
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6"
                        onClick={handleScoreSave}
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6"
                        onClick={handleScoreCancel}
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingScore(true)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffc107]/20 text-[#00796b] text-xs font-medium hover:bg-[#ffc107]/30 transition-colors"
                    >
                      {question.score}分
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* 删除按钮 */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemove(question.paperId)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>

            {/* 题目正文 */}
            <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {question.content}
            </div>

            {/* 选择题选项 */}
            {question.options && question.options.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 拖拽时的视觉反馈 */}
      {isDragging && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00796b]/5 to-[#ffc107]/5 pointer-events-none" />
      )}
    </div>
  );
}
