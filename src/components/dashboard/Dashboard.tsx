import React from 'react';
import {
  Sparkles,
  PlusCircle,
  BookOpen,
  FolderKanban,
  CheckSquare,
  FileText,
  ArrowRight,
  Clock,
  ChevronRight,
  School,
  Flame,
  Award,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import { DidacticPlan, TeacherProfile } from '../../types';

interface DashboardProps {
  profile: TeacherProfile;
  plans: DidacticPlan[];
  onNavigate: (tab: string) => void;
  onOpenPlan: (plan: DidacticPlan) => void;
  onNewPlanManual: () => void;
  onOpenAIAssistant: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  plans,
  onNavigate,
  onOpenPlan,
  onNewPlanManual,
  onOpenAIAssistant,
}) => {
  const recentPlans = [...plans]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const mainCards = [
    {
      id: 'wizard',
      title: 'Nueva planeación',
      description: 'Crear una planeación didáctica desde cero con el wizard estructurado por fases.',
      icon: PlusCircle,
      action: onNewPlanManual,
      gradient: 'from-blue-600 to-indigo-700',
      badge: 'Paso a paso',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    },
    {
      id: 'ai',
      title: 'Crear con IA',
      description: 'Generar una planeación didáctica contextualizada de 1 a 12 sesiones utilizando Gemini.',
      icon: Sparkles,
      action: onOpenAIAssistant,
      gradient: 'from-amber-600 via-orange-600 to-amber-700',
      badge: 'Asistente Gemini',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      highlightBorder: true,
    },
    {
      id: 'library',
      title: 'Mis planeaciones',
      description: 'Consultar, editar, organizar por carpetas, duplicar e imprimir tus planeaciones guardadas.',
      icon: BookOpen,
      action: () => onNavigate('library'),
      gradient: 'from-emerald-600 to-teal-700',
      badge: `${plans.length} guardadas`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    },
    {
      id: 'activities',
      title: 'Banco de actividades',
      description: 'Consultar, reutilizar e insertar dinámicas didácticas en tus proyectos escolares.',
      icon: FolderKanban,
      action: () => onNavigate('activities'),
      gradient: 'from-purple-600 to-indigo-700',
      badge: 'Reutilizable',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    },
    {
      id: 'evaluations',
      title: 'Evaluación',
      description: 'Crear rúbricas, listas de cotejo, escalas estimativas y registros formativos.',
      icon: CheckSquare,
      action: () => onNavigate('evaluations'),
      gradient: 'from-rose-600 to-pink-700',
      badge: 'Formativa',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    },
    {
      id: 'materials',
      title: 'Material didáctico',
      description: 'Crear fichas de trabajo, cuestionarios, lecturas, crucigramas y ejercicios imprimibles.',
      icon: FileText,
      action: () => onNavigate('materials'),
      gradient: 'from-cyan-600 to-blue-700',
      badge: 'Generador',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute left-1/3 bottom-0 -mb-12 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {profile.escuela || 'Primaria'} • {profile.grado} "{profile.grupo}" ({profile.turno || 'Matutino'})
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            PLANEANEM <span className="text-amber-400">IA</span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-slate-200">
            "Planea, adapta, evalúa y mejora con inteligencia artificial."
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Bienvenido, <span className="font-bold text-white">{profile.nombre || 'Docente'}</span>. Asistente pedagógico para educación primaria en México. Diseña proyectos integradores, redacta secuencias y elabora instrumentos de evaluación alineados con los cuatro campos formativos y los ejes articuladores de la NEM.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenAIAssistant}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-orange-400 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Crear con Asistente Gemini</span>
            </button>
            <button
              onClick={onNewPlanManual}
              className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs border border-white/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nueva planeación desde cero</span>
            </button>
          </div>

          {/* Información visible del autor */}
          <div className="pt-3">
            <div className="rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-amber-400/40 p-3 sm:p-4 backdrop-blur-md shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Autor
                    </span>
                    <span className="text-sm font-bold text-white">
                      Victor Manuel Santigo Abundis
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                  <a
                    href="tel:3841024218"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-slate-100 font-semibold transition border border-white/10 hover:text-amber-300"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>tel: 3841024218</span>
                  </a>
                  <a
                    href="mailto:vicynt1927@gmail.com"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-slate-100 font-semibold transition border border-white/10 hover:text-amber-300"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>mail: vicynt1927@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 6 Module Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Módulos del Asistente Docente
          </h2>
          <span className="text-xs text-slate-500">Selecciona una herramienta</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mainCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={card.action}
                className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-slate-800 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                  card.highlightBorder
                    ? 'border-amber-400/60 dark:border-amber-500/40 ring-1 ring-amber-400/30'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${card.gradient} text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  <span>Abrir módulo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Plans & Fast Access Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Plans */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Planeaciones recientes
              </h3>
            </div>
            <button
              onClick={() => onNavigate('library')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Ver todas ({plans.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {recentPlans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-800/40">
                <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No tienes planeaciones creadas aún
                </p>
                <p className="text-[11px] text-slate-500">
                  Comienza creando tu primera planeación con el asistente o desde cero.
                </p>
              </div>
            ) : (
              recentPlans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onOpenPlan(p)}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-4 shadow-2xs hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                        {p.campoFormativo}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {p.grado} {p.grupo} • {p.sesiones?.length || 0} sesiones
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {p.titulo}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {p.proposito}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-slate-400 hover:text-blue-600">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NEM Quick Tips / Pedagogy Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Pilares de la NEM
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-[11px]">
                1
              </span>
              <p>
                <strong>Autonomía profesional:</strong> Tú tienes la última palabra sobre las adecuaciones para tu grupo.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                2
              </span>
              <p>
                <strong>Comunidad al centro:</strong> Vincula los proyectos con problemáticas sentidas en el entorno escolar y local.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-[11px]">
                3
              </span>
              <p>
                <strong>Evaluación formativa:</strong> Valora el proceso, las evidencias del cuaderno y la autoevaluación, no solo un examen numérico.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 text-[11px] text-slate-400 text-center">
              Plan de Estudio SEP 2022 • Primaria
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
