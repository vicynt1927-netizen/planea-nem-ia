import { DidacticPlan, ReviewFeedback, EvaluationInstrument, MaterialItem } from '../types';

export class GeminiServiceError extends Error {
  constructor(message: string) {
    super(cleanErrorMessage(message));
    this.name = 'GeminiServiceError';
  }
}

export function cleanErrorMessage(msg: any): string {
  if (!msg) return 'Error de conexión con el servicio de IA.';
  let text = typeof msg === 'string' ? msg : JSON.stringify(msg);

  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed?.error?.message) {
        text = parsed.error.message;
      }
    } catch {
      // ignore
    }
  }

  if (
    text.includes('503') ||
    text.includes('UNAVAILABLE') ||
    text.includes('high demand') ||
    text.includes('Overloaded')
  ) {
    return 'Los servidores de Inteligencia Artificial están experimentando una alta demanda temporal. Se ha activado la plantilla curricular de respaldo o puedes reintentar en unos instantes.';
  }

  if (text.includes('429') || text.includes('RESOURCE_EXHAUSTED')) {
    return 'Límite temporal de consultas alcanzado. Por favor espera unos segundos y vuelve a intentar.';
  }

  return text;
}

function checkOnline(): void {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new GeminiServiceError(
      'Esta función necesita conexión a internet. Los datos locales siguen disponibles.'
    );
  }
}

export const geminiService = {
  // Generate Complete Plan
  async generatePlan(params: {
    instrucciones: string;
    grado: string;
    fase: string;
    campoFormativo: string;
    tipoProyecto: string;
    numeroSesiones: number;
    contenido?: string;
    pda?: string;
    ejesArticuladores?: string[];
    metodologia?: string;
    contextoGrupo?: {
      fortalezas?: string;
      necesidades?: string;
      problematicas?: string;
      caracteristicasContexto?: string;
      observaciones?: string;
    };
  }): Promise<Partial<DidacticPlan>> {
    checkOnline();

    try {
      const response = await fetch('/api/gemini/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            'No fue posible generar la planeación. Por favor verifica los campos e inténtalo de nuevo.'
        );
      }

      const data = await response.json();
      return data.plan;
    } catch (err: any) {
      if (err instanceof GeminiServiceError) throw err;
      throw new GeminiServiceError(
        err.message || 'No fue posible generar la planeación con IA. Verifica tu conexión.'
      );
    }
  },

  // Assist with individual field (e.g. redactar PDA, propósito, problemática)
  async assistField(params: {
    campo: 'contenido' | 'pda' | 'proposito' | 'problematica' | 'situacionContexto' | 'productoFinal';
    temaOProyecto: string;
    grado: string;
    campoFormativo: string;
    datosExistentes?: Record<string, string>;
  }): Promise<string> {
    checkOnline();

    try {
      const response = await fetch('/api/gemini/assist-field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al solicitar sugerencia de redacción.');
      }

      const data = await response.json();
      return data.suggestion || '';
    } catch (err: any) {
      if (err instanceof GeminiServiceError) throw err;
      throw new GeminiServiceError(
        err.message || 'No fue posible obtener sugerencia de la IA.'
      );
    }
  },

  // Smart Actions on Sessions
  // 'improve', 'new', 'simplify', 'complexify', 'questions', 'product', 'adapt', 'evaluation', 'material', 'rewording', 'coherence'
  async improveActivity(params: {
    action: string;
    sesion: any;
    grado: string;
    campoFormativo: string;
    propositoPlan: string;
    contextoGrupo?: any;
    instruccionPersonalizada?: string;
  }): Promise<any> {
    checkOnline();

    try {
      const response = await fetch('/api/gemini/improve-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al procesar la mejora didáctica.');
      }

      const data = await response.json();
      return data.updatedSesion;
    } catch (err: any) {
      if (err instanceof GeminiServiceError) throw err;
      throw new GeminiServiceError(
        err.message || 'No fue posible adaptar la actividad con IA.'
      );
    }
  },

  // Plan Coherence Review
  async reviewPlan(plan: DidacticPlan): Promise<ReviewFeedback> {
    checkOnline();

    try {
      const response = await fetch('/api/gemini/review-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al revisar la planeación.');
      }

      const data = await response.json();
      return data.review;
    } catch (err: any) {
      if (err instanceof GeminiServiceError) throw err;
      throw new GeminiServiceError(
        err.message || 'No fue posible completar la revisión inteligente con IA.'
      );
    }
  },

  // Generate Evaluation Instrument
  async generateEvaluation(params: {
    tipo: string;
    titulo: string;
    campoFormativo: string;
    grado: string;
    contenido: string;
    pda: string;
    proposito: string;
    productoEvidencia: string;
  }): Promise<Partial<EvaluationInstrument>> {
    checkOnline();

    try {
      const response = await fetch('/api/gemini/generate-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al generar el instrumento de evaluación.');
      }

      const data = await response.json();
      return data.evaluation;
    } catch (err: any) {
      if (err instanceof GeminiServiceError) throw err;
      throw new GeminiServiceError(
        err.message || 'No fue posible crear el instrumento de evaluación con IA.'
      );
    }
  },

  // Generate Didactic Material
  async generateMaterial(params: {
    tipo: string;
    titulo: string;
    grado: string;
    campoFormativo: string;
    temaOContenido: string;
    instruccionesEspecificas?: string;
  }): Promise<Partial<MaterialItem>> {
    checkOnline();

    try {
      const response = await fetch('/api/gemini/generate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al generar el material didáctico.');
      }

      const data = await response.json();
      return data.material;
    } catch (err: any) {
      if (err instanceof GeminiServiceError) throw err;
      throw new GeminiServiceError(
        err.message || 'No fue posible generar el material didáctico con IA.'
      );
    }
  },
};
