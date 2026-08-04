import { useState } from 'react';
import type { AppType } from '@/types/app';
import { Button } from '@/components/ui/button';
import { HomePage } from '@/sections/HomePage';
import { PaperBuilderApp } from '@/sections/paper-builder/PaperBuilderApp';
import { AITutorApp } from '@/sections/ai-tutor/AITutorApp';
import { Toaster } from 'sonner';
import { ArrowLeft, GraduationCap } from 'lucide-react';

type MainAppType = AppType;
type CurrentView = 'home' | MainAppType;

const pageTitles: Record<MainAppType, { title: string; subtitle: string }> = {
  'paper-builder': {
    title: '组卷系统',
    subtitle: '题库筛选、拖拽组卷、打印导出',
  },
  'ai-tutor': {
    title: 'AI智能解题',
    subtitle: '文字、拍照、语音输入，DeepSeek 解析',
  },
};

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('home');
  const currentPage = currentView === 'home' ? null : pageTitles[currentView];

  if (currentView === 'home') {
    return (
      <>
        <Toaster position="top-center" richColors />
        <HomePage onSelect={setCurrentView} />
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <Toaster position="top-center" richColors />
      
      {/* 导航栏 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('home')}
              aria-label="返回首页"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-lg bg-[#00796b] flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {currentPage?.title}
              </h1>
              <p className="text-xs text-gray-500">{currentPage?.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden">
        {currentView === 'paper-builder' && <PaperBuilderApp />}
        {currentView === 'ai-tutor' && <AITutorApp />}
      </main>
    </div>
  );
}

export default App;
