import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Printer,
  Download,
  History,
  Check,
  ShieldCheck,
  Clock,
  Edit3,
} from 'lucide-react';
import {
  DidacticPlan,
  SesionPlan,
  TeacherProfile,
  GroupContext,
  PlanVersionHistory,
} from '../../types';
import { dbService } from '../../services/db';
import { exportPlanToWord } from '../../services/exportWord';
import { SmartAIActionsModal } from './SmartAIActionsModal';
import { PlanReviewModal } from './PlanReviewModal';

interface PlanEditorProps {
  initialPlan: DidacticPlan;
  profile: TeacherProfile;
  group: GroupContext;
  onBack: () => void;
  onOpenPrintView: (plan: DidacticPlan) => void;
}

export const PlanEditor: React.FC<PlanEditorProps> = ({
  initialPlan,
  profile,
  group,
  onBack,
  onOpenPrintView,
}) => {
  const [plan, setPlan] = useState<DidacticPlan>(initialPlan);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatusText, setSaveStatusText] = useState('Cambios guardados.');

  // Modal states
  const [activeSessionForAI, setActiveSessionForAI] = useState<SesionPlan | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<PlanVersionHistory[]>([]);

  // Expanded session tracking
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const autoSaveTimerRef = useRef<any>(null);

  // Initialize all sessions expanded
  useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    plan.sesiones.forEach((s) => {
      initialMap[s.id] = true;
    });
    setExpandedSessions(initialMap);
  }, []);

  // Autoguardado logic (saves after 2.5s of inactivity when changed)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    setSaveStatusText('Tienes cambios sin guardar...');

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      await handleSave(false);
    }, 2500);

    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [plan, hasUnsavedChanges]);

  const handleSave = async (manual = true) => {
    setIsSaving(true);
    try {
      const updatedPlan: DidacticPlan = {
        ...plan,
        version: manual ? (plan.version || 1) + 1 : plan.version || 1,
        updatedAt: new Date().toISOString(),
      };
      await dbService.savePlan(updatedPlan);
      setPlan(updatedPlan);
      setHasUnsavedChanges(false);
      setSaveStatusText('Cambios guardados.');
    } catch (err) {
      setSaveStatusText('Error al autoguardar.');
    } finally {
      setIsSaving(false);
    }
  };

  // Field change on main plan
  const handleMainFieldChange = (field: keyof DidacticPlan, val: any) => {
    setPlan((prev) => ({ ...prev, [field]: val }));
    setHasUnsavedChanges(true);
  };

  // Session changes
  const handleSessionFieldChange = (
    sessionId: string,
    field: keyof SesionPlan,
    val: any
  ) => {
    setPlan((prev) => ({
      ...prev,
      sesiones: prev.sesiones.map((s) =>
        s.id === sessionId ? { ...s, [field]: val } : s
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedSessions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Add Session
  const handleAddSession = () => {
    const newNum = plan.sesiones.length + 1;
    const newSession: SesionPlan = {
      id: 's-' + Date.now(),
      numero: newNum,
      momento: `Sesión ${newNum}`,
      proposito: 'Propósito didáctico específico para esta sesión',
      tiempo: '60 min',
      organizacion: 'Equipos y plenaria',
      inicio: 'Motivación inicial y recuperación de saberes...',
      desarrollo: 'Construcción activa, indagación o producción...',
      cierre: 'Puesta en común, metacognición y registro...',
      actividadesDocente: 'Acompaña y modera la sesión.',
      actividadesAlumno: 'Trabajan en equipos y elaboran producto.',
      materiales: ['Cuaderno', 'Material de lectura'],
      productoEvidencia: 'Actividad en el cuaderno',
      evaluacion: 'Formativa procesual',
      instrumento: 'Lista de cotejo',
      adecuaciones: 'Atención personalizada según BAP.',
    };

    setPlan((prev) => ({
      ...prev,
      numeroSesiones: prev.sesiones.length + 1,
      sesiones: [...prev.sesiones, newSession],
    }));
    setExpandedSessions((prev) => ({ ...prev, [newSession.id]: true }));
    setHasUnsavedChanges(true);
  };

  // Duplicate Session
  const handleDuplicateSession = (idx: number) => {
    const target = plan.sesiones[idx];
    const duplicated: SesionPlan = {
      ...target,
      id: 's-' + Date.now(),
      numero: target.numero + 1,
      proposito: `${target.proposito} (Continuación)`,
    };

    const newSessions = [...plan.sesiones];
    newSessions.splice(idx + 1, 0, duplicated);

    // Re-index numbers
    const reindexed = newSessions.map((s, i) => ({ ...s, numero: i + 1 }));

    setPlan((prev) => ({
      ...prev,
      numeroSesiones: reindexed.length,
      sesiones: reindexed,
    }));
    setExpandedSessions((prev) => ({ ...prev, [duplicated.id]: true }));
    setHasUnsavedChanges(true);
  };

  // Delete Session
  const handleDeleteSession = (idx: number) => {
    if (plan.sesiones.length <= 1) {
      alert('La planeación debe contener al menos una sesión.');
      return;
    }
    const newSessions = plan.sesiones.filter((_, i) => i !== idx);
    const reindexed = newSessions.map((s, i) => ({ ...s, numero: i + 1 }));
    setPlan((prev) => ({
      ...prev,
      numeroSesiones: reindexed.length,
      sesiones: reindexed,
    }));
    setHasUnsavedChanges(true);
  };

  // Move Session
  const handleMoveSession = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= plan.sesiones.length) return;

    const newSessions = [...plan.sesiones];
    const temp = newSessions[idx];
    newSessions[idx] = newSessions[targetIdx];
    newSessions[targetIdx] = temp;

    const reindexed = newSessions.map((s, i) => ({ ...s, numero: i + 1 }));
    setPlan((prev) => ({ ...prev, sesiones: reindexed }));
    setHasUnsavedChanges(true);
  };

  // Open Version History
  const handleOpenHistory = async () => {
    const history = await dbService.getPlanHistory(plan.id);
    setHistoryList(history);
    setIsHistoryOpen(true);
  };

  const handleRestoreVersion = (ver: PlanVersionHistory) => {
    if (confirm(`¿Deseas restaurar los datos de "${ver.nombre}"?`)) {
      setPlan(ver.planData);
      setHasUnsavedChanges(true);
      setIsHistoryOpen(false);
    }
  };

  // Word Export
  const handleExportWord = async () => {
    await exportPlanToWord(plan, profile);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Sticky Top Editor Action Bar */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{saveStatusText}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{saveStatusText}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Smart Review button */}
          <button
            onClick={() => setIsReviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Revisar con IA</span>
          </button>

          {/* History button */}
          <button
            onClick={handleOpenHistory}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Historial de versiones"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Historial</span>
          </button>

          {/* Export Word */}
          <button
            onClick={handleExportWord}
            className="inline-flex items-center gap-1 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word (.docx)</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={() => onOpenPrintView(plan)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF / Imprimir</span>
          </button>

          {/* Save */}
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      {/* General Project Information Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 text-xs font-bold text-blue-800 dark:text-blue-200">
              {plan.campoFormativo}
            </span>
            <span className="rounded-lg bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
              {plan.fase} • {plan.grado} "{plan.grupo}"
            </span>
            <span className="rounded-lg bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
              Proyecto de {plan.tipoProyecto}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Versión {plan.version || 1} • {plan.sesiones.length} sesiones
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Título del Proyecto
            </label>
            <input
              type="text"
              value={plan.titulo}
              onChange={(e) => handleMainFieldChange('titulo', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2.5 text-base font-extrabold text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Metodología
              </label>
              <input
                type="text"
                value={plan.metodologia}
                onChange={(e) => handleMainFieldChange('metodologia', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Temporalidad
              </label>
              <input
                type="text"
                value={plan.temporalidad}
                onChange={(e) => handleMainFieldChange('temporalidad', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Contenido oficial del programa
            </label>
            <textarea
              rows={2}
              value={plan.contenido}
              onChange={(e) => handleMainFieldChange('contenido', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Proceso de Desarrollo de Aprendizaje (PDA)
            </label>
            <textarea
              rows={2}
              value={plan.pda}
              onChange={(e) => handleMainFieldChange('pda', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Propósito del proyecto
              </label>
              <textarea
                rows={2}
                value={plan.proposito}
                onChange={(e) => handleMainFieldChange('proposito', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Producto final / Evidencia tangible
              </label>
              <textarea
                rows={2}
                value={plan.productoFinal}
                onChange={(e) => handleMainFieldChange('productoFinal', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SESSIONS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Secuencia Didáctica ({plan.sesiones.length} sesiones)
            </h2>
            <p className="text-xs text-slate-500">
              Cada sesión cuenta con tarjetas editables y botones inteligentes de IA.
            </p>
          </div>

          <button
            onClick={handleAddSession}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Sesión</span>
          </button>
        </div>

        {plan.sesiones.map((s, idx) => {
          const isExpanded = expandedSessions[s.id] !== false;
          return (
            <div
              key={s.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs overflow-hidden transition"
            >
              {/* Session Header Card */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/80">
                <div
                  onClick={() => toggleExpand(s.id)}
                  className="flex items-center gap-3 cursor-pointer select-none flex-1 pr-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xs">
                    {s.numero}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {s.momento}
                      </h3>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        • {s.tiempo} • {s.organizacion}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                      {s.proposito}
                    </p>
                  </div>
                </div>

                {/* Session Action Tools */}
                <div className="flex items-center gap-1">
                  {/* Smart Actions Button */}
                  <button
                    onClick={() => setActiveSessionForAI(s)}
                    className="inline-flex items-center gap-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/40 px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                    title="Acciones inteligentes con IA"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden sm:inline">Botones IA</span>
                  </button>

                  <button
                    onClick={() => handleMoveSession(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                    title="Mover arriba"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveSession(idx, 'down')}
                    disabled={idx === plan.sesiones.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                    title="Mover abajo"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicateSession(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Duplicar sesión"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSession(idx)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 cursor-pointer"
                    title="Eliminar sesión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Session Body (Collapsible) */}
              {isExpanded && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Momento metodológico
                      </label>
                      <input
                        type="text"
                        value={s.momento}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'momento', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tiempo estimado
                      </label>
                      <input
                        type="text"
                        value={s.tiempo}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'tiempo', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Organización
                      </label>
                      <input
                        type="text"
                        value={s.organizacion}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'organizacion', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Propósito de la sesión
                    </label>
                    <input
                      type="text"
                      value={s.proposito}
                      onChange={(e) =>
                        handleSessionFieldChange(s.id, 'proposito', e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Inicio, Desarrollo, Cierre */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/20 p-3.5 space-y-1.5">
                      <span className="text-[11px] font-black uppercase text-blue-700 dark:text-blue-400">
                        INICIO
                      </span>
                      <textarea
                        rows={5}
                        value={s.inicio}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'inicio', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/20 p-3.5 space-y-1.5">
                      <span className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-400">
                        DESARROLLO
                      </span>
                      <textarea
                        rows={5}
                        value={s.desarrollo}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'desarrollo', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20 p-3.5 space-y-1.5">
                      <span className="text-[11px] font-black uppercase text-purple-700 dark:text-purple-400">
                        CIERRE
                      </span>
                      <textarea
                        rows={5}
                        value={s.cierre}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'cierre', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Actividades del Docente y del Alumno */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Actividades del Docente
                      </label>
                      <textarea
                        rows={2}
                        value={s.actividadesDocente}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'actividadesDocente', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Actividades del Alumno
                      </label>
                      <textarea
                        rows={2}
                        value={s.actividadesAlumno}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'actividadesAlumno', e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Materiales, Producto y Evaluación */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Materiales y recursos
                      </label>
                      <input
                        type="text"
                        value={s.materiales?.join(', ') || ''}
                        onChange={(e) =>
                          handleSessionFieldChange(
                            s.id,
                            'materiales',
                            e.target.value.split(',').map((m) => m.trim())
                          )
                        }
                        placeholder="Ej. Cuaderno, cartulinas, libro SEP"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Producto / Evidencia de aprendizaje
                      </label>
                      <input
                        type="text"
                        value={s.productoEvidencia}
                        onChange={(e) =>
                          handleSessionFieldChange(s.id, 'productoEvidencia', e.target.value)
                        }
                        placeholder="Ej. Tabla comparativa en cuaderno"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Evaluación formativa e Instrumento
                      </label>
                      <input
                        type="text"
                        value={`${s.evaluacion || ''} | ${s.instrumento || ''}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('|');
                          handleSessionFieldChange(s.id, 'evaluacion', parts[0]?.trim() || '');
                          if (parts[1]) {
                            handleSessionFieldChange(s.id, 'instrumento', parts[1].trim());
                          }
                        }}
                        placeholder="Ej. Formativa procesual | Lista de cotejo"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Adecuaciones curriculares / Apoyo específico (BAP)
                    </label>
                    <input
                      type="text"
                      value={s.adecuaciones || ''}
                      onChange={(e) =>
                        handleSessionFieldChange(s.id, 'adecuaciones', e.target.value)
                      }
                      placeholder="Ej. Uso de imágenes, lectura en pares tutorados y tiempo flexible."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Smart Actions Modal */}
      {activeSessionForAI && (
        <SmartAIActionsModal
          isOpen={!!activeSessionForAI}
          onClose={() => setActiveSessionForAI(null)}
          sesion={activeSessionForAI}
          plan={plan}
          group={group}
          onSessionUpdated={(updated) => {
            setPlan((prev) => ({
              ...prev,
              sesiones: prev.sesiones.map((s) => (s.id === updated.id ? updated : s)),
            }));
            setHasUnsavedChanges(true);
          }}
        />
      )}

      {/* Plan Review Modal */}
      {isReviewOpen && (
        <PlanReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          plan={plan}
          onApplySuggestion={(sug) => {
            const sec = sug.seccion.toLowerCase();
            if (sec.includes('propósito') || sec.includes('proposito')) {
              handleMainFieldChange('proposito', sug.cambioPropuesto);
            } else if (sec.includes('producto')) {
              handleMainFieldChange('productoFinal', sug.cambioPropuesto);
            } else if (sec.includes('contenido')) {
              handleMainFieldChange('contenido', sug.cambioPropuesto);
            } else if (sec.includes('pda')) {
              handleMainFieldChange('pda', sug.cambioPropuesto);
            }
          }}
        />
      )}

      {/* Version History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Historial de Versiones del Plan
              </h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {historyList.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  No hay versiones previas registradas aún.
                </p>
              ) : (
                historyList.map((ver) => (
                  <div
                    key={ver.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {ver.nombre}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(ver.fecha).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRestoreVersion(ver)}
                      className="rounded-lg bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 cursor-pointer"
                    >
                      Restaurar versión
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
