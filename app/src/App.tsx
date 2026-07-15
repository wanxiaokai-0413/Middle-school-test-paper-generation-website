import { useState } from 'react';
import type { AppType } from '@/types/app';
import { AppSwitcher } from '@/components/AppSwitcher';
import { PaperBuilderApp } from '@/sections/paper-builder/PaperBuilderApp';
import { AITutorApp } from '@/sections/ai-tutor/AITutorApp';
import { AvatarEditorApp } from '@/sections/avatar-editor/AvatarEditorApp';
import { Toaster } from 'sonner';
import { GraduationCap } from 'lucide-react';

function App() {
  const [currentApp, setCurrentApp] = useState<AppType>('paper-builder');

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-center" richColors />
      
      {/* 导航栏 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00796b] to-[#004d40] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#00796b] to-[#004d40] bg-clip-text text-transparent">
                组卷精灵
              </h1>
              <p className="text-xs text-gray-500">智能教育平台</p>
            </div>
          </div>

          {/* 应用切换器 */}
          <AppSwitcher currentApp={currentApp} onSwitch={setCurrentApp} />
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-hidden">
        {currentApp === 'paper-builder' && <PaperBuilderApp />}
        {currentApp === 'ai-tutor' && <AITutorApp />}
        {currentApp === 'avatar-editor' && <AvatarEditorApp />}
      </main>
    </div>
  );
}

export default App;
