import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Compass,
  FileCheck,
  Layers,
  HelpCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  CAMPOS_FORMATIVOS,
  EJES_ARTICULADORES,
  METODOLOGIAS_NEM,
  TIPOS_PROYECTO,
  GRADOS_PRIMARIA,
  CURRICULO_SUGERIDO,
  MOMENTOS_PROYECTOS_COMUNITARIOS,
} from '../../data/nemCatalogs';
import {
  CampoFormativo,
  EjeArticulador,
  FaseNEM,
  MetodologiaNEM,
  TipoProyecto,
  DidacticPlan,
  TeacherProfile,
  GroupContext,
} from '../../types';
import { geminiService } from '../../services/geminiService';

interface PlanWizardProps {
  profile: TeacherProfile;
  group: GroupContext;
  onPlanCreated: (plan: DidacticPlan) => void;
  onCancel: () => void;
}

export const PlanWizard: React.FC<PlanWizardProps> = ({
  profile,
  group,
  onPlanCreated,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [tipoProyecto, setTipoProyecto] = useState<TipoProyecto>('Aula');
  const [campoFormativo, setCampoFormativo] = useState<CampoFormativo>('Lenguajes');
  const [grado, setGrado] = useState(profile.grado || '4°');
  const [grupoName, setGrupoName] = useState(profile.grupo || 'A');
  const [fase, setFase] = useState<FaseNEM>('Fase 4');
  const [temporalidad, setTemporalidad] = useState('2 semanas (10 sesiones)');
  const [numeroSesiones, setNumeroSesiones] = useState(10);
  const [duracionSesion, setDuracionSesion] = useState('60 minutos');

  const [ejesArticuladores, setEjesArticuladores] = useState<EjeArticulador[]>([
    'Inclusión',
    'Pensamiento crítico',
    'Apropiación de las culturas a través de la lectura y la escritura',
  ]);

  const [metodologia, setMetodologia] = useState<MetodologiaNEM>(
    'Aprendizaje basado en proyectos comunitarios'
  );

  const [contenido, setContenido] = useState('');
  const [pda, setPda] = useState('');
  const [proposito, setProposito] = useState('');
  const [problematica, setProblematica] = useState(group.problematicas || '');
  const [situacionContexto, setSituacionContexto] = useState(group.caracteristicasContexto || '');
  const [productoFinal, setProductoFinal] = useState('');

  // AI Assistance states
  const [assistingField, setAssistingField] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Update Fase automatically when Grado changes
  const handleGradoChange = (g: string) => {
    setGrado(g);
    const found = GRADOS_PRIMARIA.find((item) => item.grado === g);
    if (found) setFase(found.fase);
  };

  // Toggle Ejes Articuladores
  const toggleEje = (eje: EjeArticulador) => {
    if (ejesArticuladores.includes(eje)) {
      setEjesArticuladores(ejesArticuladores.filter((e) => e !== eje));
    } else {
      setEjesArticuladores([...ejesArticuladores, eje]);
    }
  };

  // Pre-fill curriculum suggestions
  const suggestedCurriculum = CURRICULO_SUGERIDO[grado]?.filter(
    (c) => c.campo === campoFormativo
  );

  const handleApplyCurriculum = (item: { contenido: string; pda: string }) => {
    setContenido(item.contenido);
    setPda(item.pda);
  };

  // AI Field Assistant
  const handleAIAssistField = async (
    field: 'contenido' | 'pda' | 'proposito' | 'problematica' | 'situacionContexto' | 'productoFinal'
  ) => {
    setAssistingField(field);
    setGenerationError(null);
    try {
      const suggestion = await geminiService.assistField({
        campo: field,
        temaOProyecto: titulo || 'Proyecto integrador de primaria',
        grado,
        campoFormativo,
        datosExistentes: {
          titulo,
          campoFormativo,
          contenido,
          pda,
          proposito,
        },
      });

      if (field === 'contenido') setContenido(suggestion);
      else if (field === 'pda') setPda(suggestion);
      else if (field === 'proposito') setProposito(suggestion);
      else if (field === 'problematica') setProblematica(suggestion);
      else if (field === 'situacionContexto') setSituacionContexto(suggestion);
      else if (field === 'productoFinal') setProductoFinal(suggestion);
    } catch (err: any) {
      setGenerationError(err.message || 'Error al obtener sugerencia de IA');
    } finally {
      setAssistingField(null);
    }
  };

  // Final creation: Manual structure or AI populated
  const handleCreatePlan = async (withAI: boolean) => {
    setGenerationError(null);

    const basePlan: DidacticPlan = {
      id: 'plan-' + Date.now(),
      titulo: titulo.trim() || 'Proyecto Didáctico sin título',
      tipoProyecto,
      campoFormativo,
      grado,
      grupo: grupoName,
      fase,
      temporalidad,
      numeroSesiones,
      duracionSesion,
      ejesArticuladores,
      metodologia,
      contenido: contenido.trim(),
      pda: pda.trim(),
      proposito: proposito.trim(),
      problematica: problematica.trim(),
      situacionContexto: situacionContexto.trim(),
      productoFinal: productoFinal.trim(),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sesiones: [],
    };

    if (!withAI) {
      // Create empty sessions with appropriate methodology moments
      const sessions = [];
      const selectedMetodo = METODOLOGIAS_NEM.find((m) => m.id === metodologia);
      const momentosList =
        selectedMetodo?.fasesMomentos || MOMENTOS_PROYECTOS_COMUNITARIOS;

      for (let i = 1; i <= numeroSesiones; i++) {
        const momentoIdx = (i - 1) % momentosList.length;
        sessions.push({
          id: 's-' + Date.now() + '-' + i,
          numero: i,
          momento: momentosList[momentoIdx] || `Sesión ${i}`,
          proposito: `Propósito didáctico para la sesión ${i}`,
          tiempo: duracionSesion,
          organizacion: 'Equipos y plenaria',
          inicio: 'Recuperación de conocimientos previos y planteamiento de la pregunta guía...',
          desarrollo: 'Actividad práctica guiada, análisis de textos o resolución colaborativa...',
          cierre: 'Puesta en común, registro de conclusiones en el cuaderno y evaluación...',
          actividadesDocente: 'Modela, acompaña a los equipos y formula preguntas reflexivas.',
          actividadesAlumno: 'Participan activamente, dialogan y registran evidencias.',
          materiales: ['Libro de texto gratuito', 'Cuaderno del alumno', 'Material didáctico'],
          productoEvidencia: `Evidencia de trabajo sesión ${i}`,
          evaluacion: 'Formativa procesual',
          instrumento: 'Lista de cotejo',
          adecuaciones: 'Atención diferenciada según ritmos de aprendizaje.',
        });
      }

      basePlan.sesiones = sessions;
      onPlanCreated(basePlan);
    } else {
      // Generate sessions using Gemini
      setIsGeneratingAll(true);
      try {
        const aiResult = await geminiService.generatePlan({
          instrucciones: `Proyecto: ${titulo}. Propósito: ${proposito}. Producto: ${productoFinal}`,
          grado,
          fase,
          campoFormativo,
          tipoProyecto,
          numeroSesiones,
          contenido,
          pda,
          ejesArticuladores,
          metodologia,
          contextoGrupo: group,
        });

        const completePlan: DidacticPlan = {
          ...basePlan,
          ...aiResult,
          id: basePlan.id,
          createdAt: basePlan.createdAt,
          updatedAt: basePlan.updatedAt,
          version: 1,
          sesiones:
            aiResult.sesiones && aiResult.sesiones.length > 0
              ? aiResult.sesiones
              : basePlan.sesiones,
        };

        onPlanCreated(completePlan);
      } catch (err: any) {
        setGenerationError(err.message || 'No se pudo generar con IA. Intenta la creación manual.');
      } finally {
        setIsGeneratingAll(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Wizard Header & Steps */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-600" />
            Nueva Planeación Didáctica
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Planificador estructurado por momentos oficiales de la Nueva Escuela Mexicana
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, label: '1. Datos Generales' },
          { step: 2, label: '2. Ejes Articuladores' },
          { step: 3, label: '3. Metodología' },
          { step: 4, label: '4. Contenidos & PDA' },
        ].map((s) => (
          <div
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`cursor-pointer rounded-xl p-2.5 text-center transition ${
              currentStep === s.step
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : currentStep > s.step
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            <p className="text-[11px] truncate">{s.label}</p>
          </div>
        ))}
      </div>

      {generationError && (
        <div
          role="alert"
          className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 space-y-3 text-xs text-rose-800 dark:text-rose-300"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-bold">Aviso del Asistente:</p>
              <p className="mt-0.5 leading-relaxed">{generationError}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-800/60">
            <button
              type="button"
              onClick={() => handleCreatePlan(true)}
              disabled={isGeneratingAll}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Reintentando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reintentar con IA</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleCreatePlan(false)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 px-3 py-1.5 font-bold transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Continuar con plantilla curricular oficial NEM</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Datos Generales */}
      {currentStep === 1 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Paso 1: Datos Generales del Proyecto
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nombre del proyecto didáctico *
              </label>
              <input
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Antología Ilustrada de Leyendas de Nuestra Comunidad"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipo de Proyecto *
                </label>
                <select
                  value={tipoProyecto}
                  onChange={(e) => setTipoProyecto(e.target.value as TipoProyecto)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                >
                  {TIPOS_PROYECTO.map((t) => (
                    <option key={t} value={t}>
                      Proyecto de {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Campo Formativo Principal *
                </label>
                <select
                  value={campoFormativo}
                  onChange={(e) => setCampoFormativo(e.target.value as CampoFormativo)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden font-semibold"
                >
                  {CAMPOS_FORMATIVOS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Grado
                </label>
                <select
                  value={grado}
                  onChange={(e) => handleGradoChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                >
                  {GRADOS_PRIMARIA.map((g) => (
                    <option key={g.grado} value={g.grado}>
                      {g.grado} Primaria
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Grupo
                </label>
                <input
                  type="text"
                  value={grupoName}
                  onChange={(e) => setGrupoName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                  placeholder="A"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Fase NEM
                </label>
                <input
                  type="text"
                  readOnly
                  value={fase}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Número de Sesiones
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={numeroSesiones}
                  onChange={(e) => setNumeroSesiones(parseInt(e.target.value, 10) || 5)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Temporalidad
                </label>
                <input
                  type="text"
                  value={temporalidad}
                  onChange={(e) => setTemporalidad(e.target.value)}
                  placeholder="Ej. 2 semanas (10 sesiones)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Duración de cada sesión
                </label>
                <input
                  type="text"
                  value={duracionSesion}
                  onChange={(e) => setDuracionSesion(e.target.value)}
                  placeholder="Ej. 50 a 60 minutos"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
            >
              <span>Continuar a Ejes Articuladores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Ejes Articuladores */}
      {currentStep === 2 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Paso 2: Ejes Articuladores de la NEM
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Selecciona uno o más ejes que dialogarán transversalmente con este proyecto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EJES_ARTICULADORES.map((eje) => {
              const isSelected = ejesArticuladores.includes(eje.id);
              return (
                <div
                  key={eje.id}
                  onClick={() => toggleEje(eje.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {eje.nombre}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {eje.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
            >
              <span>Continuar a Metodología</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Metodología */}
      {currentStep === 3 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Paso 3: Metodología Sociocrítica
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Elige el método de trabajo adecuado según el campo formativo y el propósito escolar.
            </p>
          </div>

          <div className="space-y-3">
            {METODOLOGIAS_NEM.map((metodo) => {
              const isSelected = metodologia === metodo.id;
              return (
                <div
                  key={metodo.id}
                  onClick={() => setMetodologia(metodo.id)}
                  className={`rounded-2xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {metodo.nombre}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Ideal para: {metodo.campoPrincipal}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    {metodo.descripcion}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {metodo.fasesMomentos.map((f, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-300"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer"
            >
              <span>Continuar a Contenidos & PDA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Contenidos y PDA */}
      {currentStep === 4 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Paso 4: Contenidos, PDA y Propósito Didáctico
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Escribe tus elementos curriculares o utiliza el botón "Ayudarme con IA" para obtener sugerencias de redacción.
            </p>
          </div>

          {/* Quick Curriculum presets suggestions */}
          {suggestedCurriculum && suggestedCurriculum.length > 0 && (
            <div className="rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  Sugerencias curriculares oficiales ({grado} • {campoFormativo})
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">Clic para aplicar</span>
              </div>
              <div className="space-y-2">
                {suggestedCurriculum.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleApplyCurriculum(c)}
                    className="rounded-xl border border-amber-200/70 dark:border-amber-800/50 bg-white dark:bg-slate-900/80 p-3 hover:border-amber-400 cursor-pointer transition text-xs space-y-1"
                  >
                    <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {c.contenido}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      PDA: {c.pda}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Contenido */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Contenido del programa sintético *
                </label>
                <button
                  type="button"
                  onClick={() => handleAIAssistField('contenido')}
                  disabled={assistingField === 'contenido'}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{assistingField === 'contenido' ? 'Generando...' : 'Ayudarme con IA'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Ej. Comprensión y producción de textos instructivos para realizar actividades..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden"
              />
            </div>

            {/* PDA */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Proceso de Desarrollo de Aprendizaje (PDA) *
                </label>
                <button
                  type="button"
                  onClick={() => handleAIAssistField('pda')}
                  disabled={assistingField === 'pda'}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{assistingField === 'pda' ? 'Generando...' : 'Ayudarme con IA'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={pda}
                onChange={(e) => setPda(e.target.value)}
                placeholder="Ej. Analiza las características de diversos textos instructivos e interpreta la información..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Propósito */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Propósito didáctico del proyecto *
                </label>
                <button
                  type="button"
                  onClick={() => handleAIAssistField('proposito')}
                  disabled={assistingField === 'proposito'}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{assistingField === 'proposito' ? 'Generando...' : 'Ayudarme con IA'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={proposito}
                onChange={(e) => setProposito(e.target.value)}
                placeholder="Ej. Fomentar la comprensión lectora crítica y la elaboración de una antología ilustrada colectiva."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Problemática y Contexto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Problemática detectada
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIAssistField('problematica')}
                    disabled={assistingField === 'problematica'}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                  >
                    IA
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={problematica}
                  onChange={(e) => setProblematica(e.target.value)}
                  placeholder="Ej. Dificultad para inferir ideas principales..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Situación del contexto
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIAssistField('situacionContexto')}
                    disabled={assistingField === 'situacionContexto'}
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer"
                  >
                    IA
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={situacionContexto}
                  onChange={(e) => setSituacionContexto(e.target.value)}
                  placeholder="Ej. Tradición oral de los abuelos en la comunidad..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Producto final */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Producto final o evidencia tangible *
                </label>
                <button
                  type="button"
                  onClick={() => handleAIAssistField('productoFinal')}
                  disabled={assistingField === 'productoFinal'}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{assistingField === 'productoFinal' ? 'Generando...' : 'Ayudarme con IA'}</span>
                </button>
              </div>
              <input
                type="text"
                value={productoFinal}
                onChange={(e) => setProductoFinal(e.target.value)}
                placeholder="Ej. Antología Ilustrada de Cuentos y Leyendas de Nuestra Escuela"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Action Choice: Create with Gemini AI or Create Manually */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCreatePlan(false)}
                  disabled={isGeneratingAll}
                  className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  Crear estructura y editar a mano
                </button>

                <button
                  onClick={() => handleCreatePlan(true)}
                  disabled={isGeneratingAll}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md hover:from-amber-400 hover:to-orange-400 transition cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generando {numeroSesiones} sesiones con Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generar sesiones con IA ({numeroSesiones})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
