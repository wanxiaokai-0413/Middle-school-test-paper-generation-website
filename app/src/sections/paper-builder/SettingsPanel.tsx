import type { PaperQuestion } from '@/types/question';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';
import { Award, BookOpen, Clock, TrendingUp, BarChart3 } from 'lucide-react';

interface SettingsPanelProps {
  questions: PaperQuestion[];
  totalScore: number;
  examTime: number;
}

export function SettingsPanel({ questions, totalScore, examTime }: SettingsPanelProps) {
  // 统计各题型数量
  const typeStats = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 统计各难度数量
  const difficultyStats = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 难度分布图表数据
  const difficultyData = [
    { name: '简单', value: difficultyStats.easy || 0, color: '#4caf50' },
    { name: '中等', value: difficultyStats.medium || 0, color: '#ff9800' },
    { name: '困难', value: difficultyStats.hard || 0, color: '#f44336' },
  ].filter(d => d.value > 0);

  // 题型分布图表数据
  const typeData = [
    { name: '单选', value: typeStats.single || 0, color: '#2196f3' },
    { name: '多选', value: typeStats.multiple || 0, color: '#9c27b0' },
    { name: '填空', value: typeStats.fill || 0, color: '#00bcd4' },
    { name: '解答', value: typeStats.essay || 0, color: '#ff5722' },
    { name: '计算', value: typeStats.calculation || 0, color: '#795548' },
  ].filter(d => d.value > 0);

  // 平均难度
  const avgDifficulty = questions.length > 0
    ? (questions.reduce((sum, q) => {
        const weight = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3;
        return sum + weight;
      }, 0) / questions.length).toFixed(1)
    : '0';

  // 平均每题分值
  const avgScore = questions.length > 0
    ? (totalScore / questions.length).toFixed(1)
    : '0';

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#ffc107] flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-gray-800">试卷统计</h2>
        </div>
      </div>

      {/* 统计内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 核心指标 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#00796b]/10 to-[#00796b]/5 p-3 rounded-xl">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <BookOpen className="w-3 h-3" />
              题目数量
            </div>
            <div className="text-2xl font-bold text-[#00796b]">{questions.length}</div>
          </div>
          <div className="bg-gradient-to-br from-[#ffc107]/10 to-[#ffc107]/5 p-3 rounded-xl">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <Award className="w-3 h-3" />
              总分
            </div>
            <div className="text-2xl font-bold text-[#ffc107]">{totalScore}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-3 rounded-xl">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <Clock className="w-3 h-3" />
              考试时长
            </div>
            <div className="text-2xl font-bold text-blue-600">{examTime}</div>
            <div className="text-xs text-gray-400">分钟</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-3 rounded-xl">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <TrendingUp className="w-3 h-3" />
              平均难度
            </div>
            <div className="text-2xl font-bold text-purple-600">{avgDifficulty}</div>
            <div className="text-xs text-gray-400">1-3分</div>
          </div>
        </div>

        {/* 难度分布 */}
        {difficultyData.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">难度分布</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {difficultyData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-gray-500">{item.value}题</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 题型分布 */}
        {typeData.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">题型分布</h3>
            <div className="space-y-2">
              {typeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(item.value / questions.length) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 分值分析 */}
        {questions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">分值分析</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">平均每题分值</span>
                <span className="font-medium">{avgScore}分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">最高分值</span>
                <span className="font-medium">
                  {Math.max(...questions.map(q => q.score))}分
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">最低分值</span>
                <span className="font-medium">
                  {Math.min(...questions.map(q => q.score))}分
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">添加题目后查看统计</p>
          </div>
        )}
      </div>
    </div>
  );
}
