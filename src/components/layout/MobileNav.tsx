import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  BookOpen,
  FolderKanban,
} from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'library', label: 'Planes', icon: BookOpen },
    { id: 'wizard', label: 'Crear', icon: PlusCircle, highlight: true },
    { id: 'ai-assistant', label: 'IA Asistente', icon: Sparkles, isAI: true },
    { id: 'activities', label: 'Banco', icon: FolderKanban },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-2 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        if (item.highlight) {
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className="flex flex-col items-center justify-center -mt-5 cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <Icon className="h-6 w-6" />
              </div>
              <span className="mt-1 text-[10px] font-semibold text-blue-700 dark:text-blue-400">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 transition cursor-pointer ${
              isActive
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                item.isAI && !isActive ? 'text-amber-500' : ''
              }`}
            />
            <span className="mt-1 text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
