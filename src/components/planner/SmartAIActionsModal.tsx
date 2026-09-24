import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  Wand2,
  RefreshCw,
  MinusCircle,
  PlusCircle,
  HelpCircle,
  Gift,
  HeartHandshake,
  CheckSquare,
  FileText,
  FileEdit,
  SlidersHorizontal,
} from 'lucide-react';
import { SesionPlan, DidacticPlan, GroupContext } from '../../types';
import { geminiService } from '../../services/geminiService';

interface SmartAIActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sesion: SesionPlan;
  plan: DidacticPlan;
  group: GroupContext;
  onSessionUpdated: (updatedSesion: SesionPlan) => void;
}

export const SmartAIActionsModal: React.FC<SmartAIActionsModalProps> = ({
  isOpen,
  onClose,
  sesion,
  plan,
  group,
  onSessionUpdated,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('improve');
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'improve',
      label: 'Mejorar actividad',
      icon: Wand2,
      desc: 'Enriquece y dinamiza las fases de inicio, desarrollo y cierre.',
      color: 'text-blue-600',
    },
    {
      id: 'new',
      label: 'Crear otra actividad',
      icon: RefreshCw,
      desc: 'Propone una actividad totalmente distinta con el mismo propósito.',
      color: 'text-emerald-600',
    },
    {
      id: 'simplify',
      label: 'Simplificar',
      icon: MinusCircle,
      desc: 'Reduce la complejidad cognitiva y brinda andamiajes para apoyo.',
      color: 'text-amber-600',
    },
    {
      id: 'complexify',
      label: 'Aumentar complejidad',
      icon: PlusCircle,
      desc: 'Eleva el reto intelectual y fomenta investigación profunda.',
      color: 'text-purple-600',
    },
    {
      id: 'questions',
      label: 'Crear preguntas detonadoras',
      icon: HelpCircle,
      desc: 'Formula preguntas de pensamiento crítico y metacognición.',
      color: 'text-indigo-600',
    },
    {
      id: 'product',
      label: 'Crear producto o evidencia',
      icon: Gift,
      desc: 'Diseña un entregable más tangible y motivador para el alumno.',
      color: 'text-rose-600',
    },
    {
      id: 'adapt',
      label: 'Adaptar actividad (BAP)',
      icon: HeartHandshake,
      desc: 'Ajusta la dinámica para alumnos que enfrentan barreras de aprendizaje.',
      color: 'text-teal-600',
    },
    {
      id: 'evaluation',
      label: 'Crear evaluación formativa',
      icon: CheckSquare,
      desc: 'Alinea criterios de evaluación e instrumento formativo específico.',
      color: 'text-cyan-600',
    },
    {
      id: 'material',
      label: 'Crear material didáctico',
      icon: FileText,
      desc: 'Sugiere recursos concretos o de bajo costo para enriquecer la clase.',
      color: 'text-orange-600',
    },
    {
      id: 'rewording',
      label: 'Mejorar redacción técnica',
      icon: FileEdit,
      desc: 'Pule el vocabulario pedagógico haciéndolo claro y conciso.',
      color: 'text-sky-600',
    },
    {
      id: 'coherence',
      label: 'Revisar coherencia',
      icon: SlidersHorizontal,
      desc: 'Verifica la alineación exacta con el propósito general del proyecto.',
      color: 'text-slate-600',
    },
  ];

  const handleApply = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const updated = await geminiService.improveActivity({
        action: selectedAction,
        sesion,
        grado: plan.grado,
        campoFormativo: plan.campoFormativo,
        propositoPlan: plan.proposito,
        contextoGrupo: group,
        instruccionPersonalizada: customInstruction,
      });

      onSessionUpdated({ ...sesion, ...updated });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al adaptar la actividad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Botones Inteligentes IA • Sesión {sesion.numero}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sesion.momento} • Modifica únicamente esta sesión
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Selecciona la acción que deseas que Gemini realice:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {actions.map((act) => {
                const Icon = act.icon;
                const isSelected = selectedAction === act.id;
                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedAction(act.id)}
                    className={`flex items-start gap-2.5 rounded-xl border p-3 cursor-pointer transition text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${act.color}`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {act.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Indicación o detalle extra para el maestro (opcional):
            </label>
            <input
              type="text"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Ej. Enfocar la actividad en trabajo con plastilina o dibujo grupal..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Aplicando mejora con Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ejecutar Acción Inteligente</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
