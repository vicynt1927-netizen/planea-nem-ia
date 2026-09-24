import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FormErrorSummaryProps {
  errors: string[];
  title?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({
  errors,
  title = 'Por favor revisa y corrige los siguientes campos requeridos:',
}) => {
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 p-4 text-xs text-rose-900 dark:text-rose-200 animate-in fade-in slide-in-from-top-1 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
    >
      <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300 mb-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-700 dark:text-rose-300">
        {errors.map((err, idx) => (
          <li key={idx}>{err}</li>
        ))}
      </ul>
    </div>
  );
};
