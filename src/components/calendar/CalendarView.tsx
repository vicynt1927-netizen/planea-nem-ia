import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  CheckSquare,
} from 'lucide-react';
import { DidacticPlan, EvaluationInstrument } from '../../types';

interface CalendarViewProps {
  plans: DidacticPlan[];
  evaluations: EvaluationInstrument[];
  onOpenPlan: (plan: DidacticPlan) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  plans,
  evaluations,
  onOpenPlan,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Current month details
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days for month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const startingCol = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // 0 = Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  // blanks
  for (let i = 0; i < startingCol; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            Calendario Escolar y Organización
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organiza tus sesiones didácticas, proyectos y evaluaciones en el cronograma escolar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Semana escolar
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-xs space-y-4">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-3 text-center">
          {daysOfWeek.map((day, idx) => (
            <span
              key={day}
              className={`text-xs font-extrabold uppercase tracking-wider ${
                idx >= 5 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 gap-2">
          {daysArray.map((dayNum, idx) => {
            if (!dayNum) {
              return (
                <div
                  key={`blank-${idx}`}
                  className="min-h-[90px] rounded-2xl bg-slate-50/40 dark:bg-slate-900/20 p-2"
                />
              );
            }

            // Mock session allocation for demonstration: distribute plans across days
            const dayPlans = plans.filter((_, pIdx) => (dayNum + pIdx) % 7 === 0);
            const isToday =
              dayNum === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={dayNum}
                className={`min-h-[100px] rounded-2xl border p-2 flex flex-col justify-between transition ${
                  isToday
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-500'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                      isToday
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>

                <div className="space-y-1 my-1">
                  {dayPlans.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onOpenPlan(p)}
                      className="rounded-lg bg-blue-100 dark:bg-blue-900/60 p-1 text-[10px] font-semibold text-blue-900 dark:text-blue-200 truncate cursor-pointer hover:bg-blue-200"
                      title={p.titulo}
                    >
                      {p.titulo}
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400">
                  {idx % 7 < 5 ? 'Día escolar' : 'Fin de semana'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linked active projects quick bar */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Proyectos y Evaluaciones del Periodo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {plans.slice(0, 3).map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenPlan(p)}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 hover:border-blue-400 cursor-pointer space-y-1.5 transition"
            >
              <span className="rounded-md bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                {p.campoFormativo}
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {p.titulo}
              </h4>
              <p className="text-[11px] text-slate-500">
                Temporalidad: {p.temporalidad} ({p.sesiones.length} sesiones)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
