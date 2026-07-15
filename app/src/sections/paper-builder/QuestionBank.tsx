import { useState, useMemo } from 'react';
import type { FilterCriteria } from '@/types/question';
import { mockQuestions, subjects, grades, difficulties, questionTypes } from '@/data/mockQuestions';
import { QuestionCard } from '@/components/QuestionCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionBankProps {
  onToggle: () => void;
  isCollapsed: boolean;
}

export function QuestionBank({ onToggle, isCollapsed }: QuestionBankProps) {
  const [filters, setFilters] = useState<FilterCriteria>({
    grade: 'all',
    subject: 'all',
    difficulty: 'all',
    type: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // 筛选题目
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter((question) => {
      if (filters.grade !== 'all' && question.grade !== filters.grade) return false;
      if (filters.subject !== 'all' && question.subject !== filters.subject) return false;
      if (filters.difficulty !== 'all' && question.difficulty !== filters.difficulty) return false;
      if (filters.type !== 'all' && question.type !== filters.type) return false;
      if (searchQuery && !question.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !question.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [filters, searchQuery]);

  // 统计各筛选条件下的题目数量
  const stats = useMemo(() => {
    return {
      total: filteredQuestions.length,
      byDifficulty: {
        easy: filteredQuestions.filter(q => q.difficulty === 'easy').length,
        medium: filteredQuestions.filter(q => q.difficulty === 'medium').length,
        hard: filteredQuestions.filter(q => q.difficulty === 'hard').length,
      }
    };
  }, [filteredQuestions]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mb-4"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-4">
          <BookOpen className="w-5 h-5 text-[#00796b]" />
          <span className="text-xs text-gray-500 writing-mode-vertical">题库</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00796b] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-gray-800">题库</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索题目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* 筛选器 */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Filter className="w-4 h-4" />
          <span>筛选条件</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={filters.grade}
            onValueChange={(value) => setFilters({ ...filters, grade: value as any })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="年级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部年级</SelectItem>
              {grades.map((grade) => (
                <SelectItem key={grade.value} value={grade.value}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.subject}
            onValueChange={(value) => setFilters({ ...filters, subject: value as any })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="科目" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部科目</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.value} value={subject.value}>
                  {subject.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.difficulty}
            onValueChange={(value) => setFilters({ ...filters, difficulty: value as any })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="难度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部难度</SelectItem>
              {difficulties.map((diff) => (
                <SelectItem key={diff.value} value={diff.value}>
                  {diff.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value as any })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="题型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部题型</SelectItem>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 统计标签 */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-gray-500">共 {stats.total} 题</span>
          <div className="flex items-center gap-1">
            {stats.byDifficulty.easy > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                简{stats.byDifficulty.easy}
              </span>
            )}
            {stats.byDifficulty.medium > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                中{stats.byDifficulty.medium}
              </span>
            )}
            {stats.byDifficulty.hard > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                难{stats.byDifficulty.hard}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 题目列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">暂无符合条件的题目</p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
            />
          ))
        )}
      </div>

      {/* 底部提示 */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          拖拽题目到右侧试卷中
        </p>
      </div>
    </div>
  );
}
