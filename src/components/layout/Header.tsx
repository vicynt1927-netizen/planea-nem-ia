import React from 'react';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Wifi,
  WifiOff,
  User,
  School,
} from 'lucide-react';
import { TeacherProfile, AppSettings } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface HeaderProps {
  onToggleSidebar: () => void;
  profile: TeacherProfile;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  profile,
  settings,
  onUpdateSettings,
  onNavigate,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden lg:hidden cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-900 via-indigo-800 to-blue-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                PLANEANEM
              </span>
              <span className="rounded-md bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-300/40">
                IA
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              Nueva Escuela Mexicana
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network status pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
          }`}
          title={isOnline ? 'Conexión a internet activa' : 'Sin conexión a internet (Modo offline)'}
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span className="hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Dark/Light mode toggle */}
        <button
          onClick={() =>
            onUpdateSettings({ tema: settings.tema === 'claro' ? 'oscuro' : 'claro' })
          }
          className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={settings.tema === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          aria-label="Cambiar tema"
        >
          {settings.tema === 'claro' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </button>

        {/* Teacher Profile summary */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 text-left hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xs">
            {profile.nombre ? profile.nombre.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-[130px]">
              {profile.nombre || 'Docente'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
              {profile.grado} {profile.grupo} • {profile.escuela || 'Primaria'}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
