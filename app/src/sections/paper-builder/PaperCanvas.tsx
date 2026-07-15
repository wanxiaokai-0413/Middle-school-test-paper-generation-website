import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { PaperQuestion, PaperSettings } from '@/types/question';
import { PaperQuestionItem } from '@/components/PaperQuestionItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Settings, 
  Printer, 
  FileDown, 
  RotateCcw,
  Clock,
  Award,
  HelpCircle
} from 'lucide-react';

interface PaperCanvasProps {
  questions: PaperQuestion[];
  settings: PaperSettings;
  onSettingsChange: (settings: PaperSettings) => void;
  onRemoveQuestion: (id: string) => void;
  onScoreChange: (id: string, score: number) => void;
  onClear: () => void;
}

export function PaperCanvas({
  questions,
  settings,
  onSettingsChange,
  onRemoveQuestion,
  onScoreChange,
  onClear,
}: PaperCanvasProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const { isOver, setNodeRef } = useDroppable({
    id: 'paper-canvas',
    data: { type: 'canvas' },
  });

  // 计算总分
  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
  const totalQuestions = questions.length;

  // 难度分布统计
  const difficultyStats = {
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
  };

  const handleSettingsSave = () => {
    onSettingsChange(tempSettings);
    setIsSettingsOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const paperData = {
      settings: { ...settings, totalScore },
      questions: questions.map(q => ({
        orderNumber: q.orderNumber,
        title: q.title,
        content: q.content,
        type: q.type,
        score: q.score,
        options: q.options,
        answer: q.answer,
      })),
    };
    
    const blob = new Blob([JSON.stringify(paperData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.title || '试卷'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50/50">
      {/* 工具栏 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">试卷编辑</h3>
          <span className="text-sm text-gray-500">
            ({totalQuestions}题 / {totalScore}分)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Settings className="w-4 h-4" />
                设置
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>试卷设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">试卷标题</label>
                  <Input
                    value={tempSettings.title}
                    onChange={(e) => setTempSettings({ ...tempSettings, title: e.target.value })}
                    placeholder="请输入试卷标题"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">副标题</label>
                  <Input
                    value={tempSettings.subtitle}
                    onChange={(e) => setTempSettings({ ...tempSettings, subtitle: e.target.value })}
                    placeholder="请输入副标题"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">考试时间（分钟）</label>
                  <Input
                    type="number"
                    value={tempSettings.examTime}
                    onChange={(e) => setTempSettings({ ...tempSettings, examTime: Number(e.target.value) })}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">考试说明</label>
                  <textarea
                    value={tempSettings.instructions}
                    onChange={(e) => setTempSettings({ ...tempSettings, instructions: e.target.value })}
                    className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm resize-none"
                    placeholder="请输入考试说明"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSettingsSave} className="bg-[#00796b] hover:bg-[#00695c]">
                    保存
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="gap-1" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            打印
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
            <FileDown className="w-4 h-4" />
            导出
          </Button>
          <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-600" onClick={onClear}>
            <RotateCcw className="w-4 h-4" />
            清空
          </Button>
        </div>
      </div>

      {/* A4纸张区域 */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div
          ref={setNodeRef}
          className={`
            relative w-[210mm] min-h-[297mm] bg-white shadow-xl
            transition-all duration-300
            ${isOver ? 'ring-4 ring-[#00796b]/30 ring-offset-4' : ''}
          `}
          style={{
            boxShadow: isOver 
              ? '0 25px 50px -12px rgba(0, 121, 107, 0.25)' 
              : '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* 试卷内容 */}
          <div className="p-12 min-h-[297mm]">
            {/* 试卷头部 */}
            <div className="text-center mb-8 border-b-2 border-gray-800 pb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {settings.title || '请设置试卷标题'}
              </h1>
              {settings.subtitle && (
                <p className="text-lg text-gray-600">{settings.subtitle}</p>
              )}
              <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  时间: {settings.examTime}分钟
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  满分: {totalScore}分
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  题数: {totalQuestions}题
                </span>
              </div>
            </div>

            {/* 考试说明 */}
            {settings.instructions && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>注意事项：</strong>
                <p className="mt-1 whitespace-pre-wrap">{settings.instructions}</p>
              </div>
            )}

            {/* 难度分布 */}
            {totalQuestions > 0 && (
              <div className="mb-6 flex items-center gap-4 text-xs">
                <span className="text-gray-500">难度分布:</span>
                <div className="flex items-center gap-2">
                  {difficultyStats.easy > 0 && (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                      简单 {difficultyStats.easy}题
                    </span>
                  )}
                  {difficultyStats.medium > 0 && (
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                      中等 {difficultyStats.medium}题
                    </span>
                  )}
                  {difficultyStats.hard > 0 && (
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-700">
                      困难 {difficultyStats.hard}题
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 题目列表 */}
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className={`
                  border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                  ${isOver 
                    ? 'border-[#00796b] bg-[#00796b]/5' 
                    : 'border-gray-300 bg-gray-50/50'
                  }
                `}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    试卷还是空的
                  </h3>
                  <p className="text-sm text-gray-400">
                    从左侧题库拖拽题目到这里
                  </p>
                </div>
              ) : (
                <SortableContext
                  items={questions.map(q => q.paperId)}
                  strategy={verticalListSortingStrategy}
                >
                  {questions.map((question) => (
                    <PaperQuestionItem
                      key={question.paperId}
                      question={question}
                      onRemove={onRemoveQuestion}
                      onScoreChange={onScoreChange}
                    />
                  ))}
                </SortableContext>
              )}
            </div>

            {/* 试卷底部 */}
            {questions.length > 0 && (
              <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
                — 试卷结束 —
              </div>
            )}
          </div>

          {/* 拖拽悬停效果 */}
          {isOver && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-[#00796b] text-white px-6 py-3 rounded-full shadow-lg animate-bounce">
                松开鼠标添加题目
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
