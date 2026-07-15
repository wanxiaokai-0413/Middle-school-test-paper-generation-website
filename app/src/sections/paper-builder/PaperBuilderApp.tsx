import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { Question, PaperQuestion, PaperSettings } from '@/types/question';
import { QuestionBank } from './QuestionBank';
import { PaperCanvas } from './PaperCanvas';
import { SettingsPanel } from './SettingsPanel';
import { QuestionCard } from '@/components/QuestionCard';
import { PaperQuestionItem } from '@/components/PaperQuestionItem';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function PaperBuilderApp() {
  // 试卷状态
  const [paperQuestions, setPaperQuestions] = useState<PaperQuestion[]>([]);
  const [paperSettings, setPaperSettings] = useState<PaperSettings>({
    title: '2024年秋季期中考试',
    subtitle: '数学试卷',
    examTime: 120,
    totalScore: 100,
    instructions: '1. 本试卷共XX页，满分XX分，考试时间XX分钟。\n2. 答题前请将姓名、班级、考号填写清楚。\n3. 所有答案请写在答题卡上，写在试卷上无效。',
  });

  // UI状态
  const [isBankCollapsed, setIsBankCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | PaperQuestion | null>(null);

  // 传感器配置
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 生成唯一ID
  const generatePaperId = () => uuidv4();

  // 拖拽开始
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const question = active.data.current?.question;
    if (question) {
      setActiveQuestion(question);
    }
  }, []);

  // 拖拽结束
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveQuestion(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // 从题库拖到试卷
    if (activeData?.source === 'bank' && over.id === 'paper-canvas') {
      const question = activeData.question as Question;
      const newPaperQuestion: PaperQuestion = {
        ...question,
        paperId: generatePaperId(),
        orderNumber: paperQuestions.length + 1,
        score: question.defaultScore,
      };
      
      setPaperQuestions((prev) => [...prev, newPaperQuestion]);
      toast.success(`已添加「${question.title}」到试卷`);
      return;
    }

    // 从题库拖到试卷中的某个位置
    if (activeData?.source === 'bank' && overData?.source === 'paper') {
      const question = activeData.question as Question;
      const overIndex = paperQuestions.findIndex(q => q.paperId === over.id);
      
      const newPaperQuestion: PaperQuestion = {
        ...question,
        paperId: generatePaperId(),
        orderNumber: overIndex + 1,
        score: question.defaultScore,
      };
      
      setPaperQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions.splice(overIndex, 0, newPaperQuestion);
        // 重新编号
        return newQuestions.map((q, idx) => ({ ...q, orderNumber: idx + 1 }));
      });
      toast.success(`已添加「${question.title}」到试卷`);
      return;
    }

    // 试卷内重新排序
    if (activeData?.source === 'paper' && overData?.source === 'paper') {
      const activeIndex = paperQuestions.findIndex(q => q.paperId === active.id);
      const overIndex = paperQuestions.findIndex(q => q.paperId === over.id);

      if (activeIndex !== overIndex) {
        setPaperQuestions((prev) => {
          const newQuestions = arrayMove(prev, activeIndex, overIndex);
          // 重新编号
          return newQuestions.map((q, idx) => ({ ...q, orderNumber: idx + 1 }));
        });
      }
    }
  }, [paperQuestions]);

  // 移除题目
  const handleRemoveQuestion = useCallback((paperId: string) => {
    setPaperQuestions((prev) => {
      const filtered = prev.filter(q => q.paperId !== paperId);
      // 重新编号
      return filtered.map((q, idx) => ({ ...q, orderNumber: idx + 1 }));
    });
    toast.info('已移除题目');
  }, []);

  // 修改分值
  const handleScoreChange = useCallback((paperId: string, score: number) => {
    setPaperQuestions((prev) =>
      prev.map((q) =>
        q.paperId === paperId ? { ...q, score } : q
      )
    );
  }, []);

  // 清空试卷
  const handleClear = useCallback(() => {
    if (paperQuestions.length === 0) return;
    
    if (confirm('确定要清空所有题目吗？')) {
      setPaperQuestions([]);
      toast.info('试卷已清空');
    }
  }, [paperQuestions.length]);

  // 更新试卷设置
  const handleSettingsChange = useCallback((settings: PaperSettings) => {
    setPaperSettings(settings);
    toast.success('试卷设置已保存');
  }, []);

  // 计算总分
  const totalScore = paperQuestions.reduce((sum, q) => sum + q.score, 0);

  // 拖拽动画配置
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <div className="h-full flex">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* 左侧题库 */}
        <QuestionBank 
          onToggle={() => setIsBankCollapsed(!isBankCollapsed)}
          isCollapsed={isBankCollapsed}
        />

        {/* 中间试卷区域 */}
        <PaperCanvas
          questions={paperQuestions}
          settings={paperSettings}
          onSettingsChange={handleSettingsChange}
          onRemoveQuestion={handleRemoveQuestion}
          onScoreChange={handleScoreChange}
          onClear={handleClear}
        />

        {/* 右侧统计面板 */}
        <SettingsPanel
          questions={paperQuestions}
          totalScore={totalScore}
          examTime={paperSettings.examTime}
        />

        {/* 拖拽时的浮动元素 */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeId && activeQuestion && (
            <div className="opacity-90 scale-105">
              {'paperId' in activeQuestion ? (
                <PaperQuestionItem
                  question={activeQuestion as PaperQuestion}
                  onRemove={() => {}}
                  onScoreChange={() => {}}
                />
              ) : (
                <QuestionCard
                  question={activeQuestion as Question}
                  index={0}
                />
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
