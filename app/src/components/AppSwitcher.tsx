import type { AppType, AppInfo } from '@/types/app';
import { 
  FileText, 
  Sparkles, 
  UserCircle,
  GraduationCap
} from 'lucide-react';

interface AppSwitcherProps {
  currentApp: AppType;
  onSwitch: (app: AppType) => void;
}

const apps: AppInfo[] = [
  {
    id: 'paper-builder',
    name: '组卷系统',
    description: '智能试卷组卷',
    icon: 'FileText',
    color: '#00796b',
  },
  {
    id: 'ai-tutor',
    name: 'AI解题',
    description: '智能讲解视频',
    icon: 'Sparkles',
    color: '#7c3aed',
  },
  {
    id: 'avatar-editor',
    name: '形象编辑',
    description: '定制虚拟老师',
    icon: 'UserCircle',
    color: '#ec4899',
  },
];

const iconMap = {
  FileText,
  Sparkles,
  UserCircle,
};

export function AppSwitcher({ currentApp, onSwitch }: AppSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-2 py-1.5 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-1.5 px-3 py-1">
        <GraduationCap className="w-4 h-4 text-[#00796b]" />
        <span className="text-xs font-medium text-gray-500">应用中心</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      {apps.map((app) => {
        const Icon = iconMap[app.icon as keyof typeof iconMap];
        const isActive = currentApp === app.id;
        
        return (
          <button
            key={app.id}
            onClick={() => onSwitch(app.id)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-300
              ${isActive 
                ? 'text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
            style={{
              backgroundColor: isActive ? app.color : 'transparent',
            }}
          >
            <Icon className="w-4 h-4" />
            <span>{app.name}</span>
          </button>
        );
      })}
    </div>
  );
}
