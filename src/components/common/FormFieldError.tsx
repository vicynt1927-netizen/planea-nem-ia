import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldErrorProps {
  id: string;
  error?: string;
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({ id, error }) => {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-0.5"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{error}</span>
    </p>
  );
};
