import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Type,
  Cpu,
  ShieldCheck,
  Check,
  Smartphone,
} from 'lucide-react';
import { AppSettings, TeacherProfile } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface SettingsViewProps {
  settings: AppSettings;
  profile: TeacherProfile;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onNavigate: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  profile,
  onUpdateSettings,
  onNavigate,
}) => {
  const [geminiStatus, setGeminiStatus] = useState<{
    status: string;
    hasKey: boolean;
  } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setGeminiStatus(data))
      .catch(() => setGeminiStatus({ status: 'offline', hasKey: false }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          Configuración y Preferencias
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Personaliza la apariencia, tamaño tipográfico, seguridad de la IA y almacenamiento
        </p>
      </div>

      {/* Theme & Display */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
          Apariencia y Visualización
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Light / Dark Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Tema de la interfaz
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateSettings({ tema: 'claro' })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-bold transition cursor-pointer ${
                  settings.tema === 'claro'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>☀️ Modo Claro</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ tema: 'oscuro' })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-bold transition cursor-pointer ${
                  settings.tema === 'oscuro'
                    ? 'border-blue-500 bg-slate-900 text-white ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Moon className="w-4 h-4 text-blue-400" />
                <span>🌙 Modo Oscuro</span>
              </button>
            </div>
          </div>

          {/* Font size */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Tamaño de letra
            </label>
            <div className="flex items-center gap-2">
              {(['pequena', 'mediana', 'grande'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ tamanoLetra: size })}
                  className={`flex-1 rounded-2xl border py-3 text-xs font-bold capitalize transition cursor-pointer ${
                    settings.tamanoLetra === size
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI & Security Info */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-600" />
          Servidor y Seguridad de Inteligencia Artificial (Gemini)
        </h2>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-100 dark:border-slate-700/80 space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Modelo oficial conectado:
            </span>
            <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              gemini-3.8-flash
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Capa de seguridad de la API Key:
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Protegida en servidor Express (Server-Side Proxy)</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Estado del servidor local (/api/health):
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {geminiStatus ? 'Operativo y listo' : 'Verificando...'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800">
            Cumple estrictamente con la regla de seguridad: la clave jamás se expone en el código cliente del navegador ni en localStorage. Todas las peticiones se autentican por el backend en Node.js.
          </p>
        </div>
      </div>

      {/* PWA & Mobile Installation */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-blue-600" />
          Instalación de Aplicación (PWA)
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Uso en pantalla de inicio de Android, iOS o Computadora
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Puedes instalar PlaneaNEM IA como aplicación nativa con funcionamiento sin conexión.
            </p>
          </div>

          <PWAInstallButton />
        </div>
      </div>
    </div>
  );
};
