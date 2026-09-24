import React from 'react';
import {
  LayoutDashboard,
  User,
  Users,
  PlusCircle,
  Sparkles,
  BookOpen,
  FolderKanban,
  CheckSquare,
  FileText,
  Calendar,
  Database,
  Settings,
  X,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, category: 'Principal' },
    { id: 'profile', label: 'Mi perfil', icon: User, category: 'Docencia' },
    { id: 'group', label: 'Mi grupo', icon: Users, category: 'Docencia' },
    { id: 'wizard', label: 'Nueva planeación', icon: PlusCircle, category: 'Planeación', highlight: true },
    { id: 'ai-assistant', label: 'Asistente IA', icon: Sparkles, category: 'Planeación', isAI: true },
    { id: 'library', label: 'Mis planeaciones', icon: BookOpen, category: 'Planeación' },
    { id: 'activities', label: 'Banco de actividades', icon: FolderKanban, category: 'Herramientas' },
    { id: 'evaluations', label: 'Evaluación', icon: CheckSquare, category: 'Herramientas' },
    { id: 'materials', label: 'Material didáctico', icon: FileText, category: 'Herramientas' },
    { id: 'calendar', label: 'Calendario', icon: Calendar, category: 'Gestión' },
    { id: 'backups', label: 'Respaldos', icon: Database, category: 'Gestión' },
    { id: 'settings', label: 'Configuración', icon: Settings, category: 'Gestión' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 flex' : '-translate-x-full lg:flex'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-indigo-700 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                PLANEANEM IA
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Educación Primaria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {['Principal', 'Docencia', 'Planeación', 'Herramientas', 'Gestión'].map((cat) => {
            const items = menuItems.filter((i) => i.category === cat);
            if (!items.length) return null;

            return (
              <div key={cat} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {cat}
                </p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-semibold dark:bg-blue-600'
                          : item.highlight
                          ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : item.isAI
                            ? 'text-amber-500 dark:text-amber-400 animate-pulse'
                            : item.highlight
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.isAI && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }`}
                        >
                          Gemini
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-3 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Asistente Docente NEM
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Herramienta de apoyo al criterio profesional del maestro.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
