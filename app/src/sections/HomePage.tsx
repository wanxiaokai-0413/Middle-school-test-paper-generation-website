import type { AppType } from '@/types/app';
import {
  ArrowRight,
  Check,
  FileText,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type HomeAppType = AppType;

interface HomePageProps {
  onSelect: (app: HomeAppType) => void;
}

const entryCards = [
  {
    id: 'paper-builder' as const,
    title: '组卷系统',
    audience: '教师工作空间',
    description: '面向日常备课与考试出卷，帮助教师快速完成题目筛选、试卷编排和打印交付。',
    icon: FileText,
    tint: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'group-hover:border-emerald-200 group-hover:shadow-emerald-950/10',
    action: '进入组卷系统',
    features: ['按学科与题型筛选题目', '拖拽编排 A4 试卷', '打印并导出完整试卷'],
  },
  {
    id: 'ai-tutor' as const,
    title: 'AI解题',
    audience: '师生解题空间',
    description: '面向题目讲解与自学答疑，支持多种输入方式，并输出可阅读的分步骤解析。',
    icon: Sparkles,
    tint: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'group-hover:border-violet-200 group-hover:shadow-violet-950/10',
    action: '开始 AI 解题',
    features: ['文字与语音输入题目', '图片 OCR 识别题干', 'AI 分步骤生成解析'],
  },
];

export function HomePage({ onSelect }: HomePageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00796b] shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-950">组卷精灵</h1>
              <p className="truncate text-xs text-slate-500">中学智能教学辅助平台</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-slate-950 sm:text-[40px]">
            选择工作场景，进入对应工具
          </h2>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2" aria-label="功能入口">
          {entryCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelect(card.id)}
                className={`group flex min-h-[292px] flex-col rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 ${card.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${card.tint}`}>
                    <Icon className={`h-7 w-7 ${card.text}`} />
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {card.audience}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>

                <ul className="mt-5 grid gap-2.5 text-sm text-slate-700">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className={`h-4 w-4 shrink-0 ${card.text}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t border-slate-100 pt-5">
                  <span className={`inline-flex items-center gap-2 text-sm font-semibold ${card.text}`}>
                    {card.action}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl px-5 py-4 text-sm text-slate-500 sm:px-6">
          <div className="flex items-center gap-2 font-medium text-slate-600">
            <ShieldCheck className="h-4 w-4 text-[#00796b]" />
            数据与服务说明
          </div>
        </div>
      </footer>
    </div>
  );
}
