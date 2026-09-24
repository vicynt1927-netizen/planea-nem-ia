import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
  FileJson,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { backupService } from '../../services/backupService';
import { dbService } from '../../services/db';

interface BackupViewProps {
  onRefreshAllData: () => Promise<void>;
}

export const BackupView: React.FC<BackupViewProps> = ({ onRefreshAllData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      await backupService.downloadBackupFile();
      setStatusMessage({
        type: 'success',
        text: '¡Respaldo descargado exitosamente como planeanem-respaldo.json!',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'Error al generar el respaldo: ' + (err.message || 'Desconocido'),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('¿Deseas restaurar este respaldo? La información actual será complementada o actualizada con los datos del archivo.')) {
      e.target.value = '';
      return;
    }

    setIsImporting(true);
    setStatusMessage(null);
    try {
      const res = await backupService.restoreFromFile(file);
      await onRefreshAllData();
      setStatusMessage({
        type: 'success',
        text: `¡${res.message} Se recuperaron ${res.countPlans} planeaciones y todos los datos escolares.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al restaurar el archivo JSON.',
      });
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleResetDemo = async () => {
    if (
      confirm(
        '¿Deseas restablecer todos los datos a la demostración inicial (3 proyectos de 4° primaria de Lenguajes, Ciencias y Ética)? Todos los cambios no respaldados se reemplazarán.'
      )
    ) {
      setIsResetting(true);
      setStatusMessage(null);
      try {
        await dbService.resetToDemo();
        await onRefreshAllData();
        setStatusMessage({
          type: 'success',
          text: 'Se han restablecido los datos de demostración de 4° primaria.',
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: 'Error al restablecer los datos: ' + err.message,
        });
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Database className="w-6 h-6 text-blue-600" />
          Respaldos y Seguridad de Datos
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Exporta tu archivo portátil para llevar tus planeaciones a otra computadora o restaurar en caso de cambio de equipo.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXPORT CARD */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            <Download className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Exportar Respaldo Portátil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Descarga un archivo <strong>planeanem-respaldo.json</strong> con todas tus planeaciones, actividades del banco, rúbricas de evaluación, carpetas y perfil escolar.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-3 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2 border border-slate-100 dark:border-slate-700/80">
            <FileJson className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Formato universal JSON seguro y legible.</span>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando respaldo...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar planeanem-respaldo.json</span>
              </>
            )}
          </button>
        </div>

        {/* IMPORT CARD */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Importar y Restaurar Respaldo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Recupera tu trabajo seleccionando un archivo JSON generado previamente en cualquier dispositivo o navegador.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-3 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2 border border-amber-200 dark:border-amber-900/80">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Se solicitará tu confirmación antes de aplicar los datos.</span>
          </div>

          <label className="inline-flex items-center justify-center gap-2 w-full rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 py-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/50 transition cursor-pointer text-center">
            <Upload className="w-4 h-4" />
            <span>{isImporting ? 'Restaurando información...' : 'Seleccionar archivo .json para restaurar'}</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              disabled={isImporting}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Reset to Demo Data Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-slate-500" />
          Restablecer datos de prueba
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Si eliminaste los ejemplos o deseas explorar nuevamente las 3 planeaciones modelo de 4° primaria (Lenguajes, Ciencias y Convivencia), puedes restablecer la base de datos local a su estado de fábrica.
        </p>
        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          {isResetting ? 'Restableciendo...' : 'Restablecer proyectos de demostración'}
        </button>
      </div>
    </div>
  );
};
