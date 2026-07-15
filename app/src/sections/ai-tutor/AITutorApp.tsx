import { useState } from 'react';
import type { AnalysisResult as AnalysisResultType, VideoResult, VideoConfig } from '@/types/app';
import { analyzeQuestion, generateExplanationVideo } from '@/services/aiService';
import { QuestionInput } from './QuestionInput';
import { AnalysisResult } from './AnalysisResult';
import { VideoPlayer } from './VideoPlayer';
import { presetAvatars } from '@/data/avatars';
import { toast } from 'sonner';
import { Sparkles, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 历史记录类型
interface HistoryItem {
  id: string;
  question: string;
  timestamp: Date;
  hasVideo: boolean;
}

export function AITutorApp() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<VideoResult | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showVideo, setShowVideo] = useState(false);

  // 处理题目提交
  const handleQuestionSubmit = async (question: string, imageData?: string | null) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setGeneratedVideo(null);
    setShowVideo(false);

    try {
      const result = await analyzeQuestion(question, imageData);
      setAnalysisResult(result);
      
      // 添加到历史记录
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        question: question.slice(0, 50) + (question.length > 50 ? '...' : ''),
        timestamp: new Date(),
        hasVideo: false,
      };
      setHistory(prev => [historyItem, ...prev]);
      
      toast.success('分析完成！');
    } catch (error) {
      toast.error('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 生成视频
  const handleGenerateVideo = async () => {
    if (!analysisResult) return;

    setIsGeneratingVideo(true);
    try {
      const videoConfig: VideoConfig = {
        avatarId: presetAvatars[0].id, // 使用默认形象
        background: 'classroom',
        subtitleEnabled: true,
        highlightFormulas: true,
        explanationSpeed: 'normal',
        showStepByStep: true,
      };

      const video = await generateExplanationVideo(analysisResult, videoConfig);
      setGeneratedVideo(video);
      setShowVideo(true);
      
      // 更新历史记录
      setHistory(prev => prev.map(item => 
        item.id === prev[0]?.id ? { ...item, hasVideo: true } : item
      ));
      
      toast.success('视频生成成功！');
    } catch (error) {
      toast.error('视频生成失败，请重试');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // 返回分析结果
  const handleBackToAnalysis = () => {
    setShowVideo(false);
  };

  // 重新生成视频
  const handleRegenerateVideo = () => {
    setShowVideo(false);
    handleGenerateVideo();
  };

  // 清空历史
  const handleClearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      setHistory([]);
      toast.info('历史记录已清空');
    }
  };

  return (
    <div className="h-full flex">
      {/* 左侧主区域 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              AI智能解题
            </h1>
            <p className="text-gray-500 mt-2">
              拍照、语音或输入题目，AI为您详细讲解
            </p>
          </div>

          {/* 题目输入 */}
          <QuestionInput 
            onSubmit={handleQuestionSubmit}
            isLoading={isAnalyzing}
          />

          {/* 分析结果 */}
          {analysisResult && !showVideo && (
            <AnalysisResult
              result={analysisResult}
              onGenerateVideo={handleGenerateVideo}
              isGeneratingVideo={isGeneratingVideo}
            />
          )}

          {/* 视频播放 */}
          {showVideo && generatedVideo && analysisResult && (
            <VideoPlayer
              video={generatedVideo}
              analysisResult={analysisResult}
              onBack={handleBackToAnalysis}
              onRegenerate={handleRegenerateVideo}
            />
          )}

          {/* 功能介绍 */}
          {!analysisResult && (
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-800">智能识别</h3>
                <p className="text-sm text-gray-500 mt-1">支持文字、图片、语音多种输入方式</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">深度解析</h3>
                <p className="text-sm text-gray-500 mt-1">AI分析知识点，给出详细解题步骤</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800">视频讲解</h3>
                <p className="text-sm text-gray-500 mt-1">虚拟老师生成讲解视频，生动易懂</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右侧历史记录 */}
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-gray-800">历史记录</h3>
            </div>
            {history.length > 0 && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleClearHistory}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <History className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂无历史记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors cursor-pointer"
                >
                  <p className="text-sm text-gray-700 line-clamp-2">{item.question}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                    {item.hasVideo && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                        有视频
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
