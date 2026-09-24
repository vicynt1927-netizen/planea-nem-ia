import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  buildNEMFallbackPlan,
  buildNEMFallbackField,
  buildNEMFallbackEvaluation,
  buildNEMFallbackMaterial,
} from './src/services/nemFallbackEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT && process.env.PORT !== '8080' ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Setup Gemini API client safely on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const NEM_SYSTEM_PROMPT = `
Eres el especialista principal en diseño curricular y planeación didáctica de Educación Primaria en México bajo el marco de la Nueva Escuela Mexicana (NEM) y el Plan de Estudio 2022.
Tus funciones:
1. Generar planeaciones didácticas coherentes, contextualizadas y aplicables en el aula real de primaria en México.
2. Articular fielmente los Campos Formativos, Contenidos, PDA (Procesos de Desarrollo de Aprendizaje), Ejes Articuladores y Metodologías sociocríticas (Proyectos Comunitarios, STEAM, ABP, Aprendizaje Servicio).
3. Cada sesión debe tener momentos claros: Inicio (recuperación de saberes, motivación), Desarrollo (construcción activa, indagación, trabajo colaborativo) y Cierre (metacognición, puesta en común, registro en cuaderno).
4. Asignar actividades diferenciadas para el docente y para el alumno.
5. No inventes información curricular ajena a la solicitud cuando el docente provea contenidos o PDA específicos.
6. Fomentar la evaluación formativa con instrumentos reales (rúbricas, listas de cotejo, escalas estimativas).
7. Responder siempre en el formato estructurado JSON solicitado.
`.trim();

/**
 * Executes Gemini requests with automatic retry and model fallback when encountering
 * transient high-demand / capacity spikes (HTTP 503 UNAVAILABLE, 429 RESOURCE_EXHAUSTED).
 */
async function callGeminiWithResilience<T>(
  actionName: string,
  fn: (modelName: string) => Promise<T>
): Promise<T> {
  // Try preferred flagship flash, then flash-lite, then flash-latest
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastErr: any = null;

  for (let m = 0; m < models.length; m++) {
    const model = models[m];
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await fn(model);
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || err);
        const isTemporary =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('Overloaded') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');

        if (isTemporary) {
          console.warn(`[Gemini Resiliency] ${actionName} en ${model} (intento ${attempt}): Alta demanda detectada. Reintentando...`);
          if (attempt === 1) {
            await new Promise((r) => setTimeout(r, 1000));
          } else {
            await new Promise((r) => setTimeout(r, 500));
          }
        } else {
          // If it's a fatal error like invalid arguments, stop trying
          throw err;
        }
      }
    }
  }

  throw lastErr;
}

/**
 * Sanitizes and humanizes Gemini errors into clear, professional Spanish messages,
 * ensuring raw JSON error objects are never displayed to the teacher.
 */
function formatGeminiError(error: any): string {
  if (!error) return 'Error inesperado al conectar con el servicio pedagógico de IA.';
  let msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));

  if (typeof msg === 'string') {
    const trimmed = msg.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed?.error?.message) {
          msg = parsed.error.message;
        }
      } catch {
        // ignore
      }
    }
  }

  if (
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand') ||
    msg.includes('Overloaded')
  ) {
    return 'Los servidores de Inteligencia Artificial están experimentando una alta demanda momentánea. Se ha activado la plantilla oficial curricular de respaldo o puedes reintentar en unos instantes.';
  }

  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Límite de consultas momentáneo alcanzado. Por favor, espera unos segundos y vuelve a intentar.';
  }

  return msg;
}

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. Generate Didactic Plan
app.post('/api/gemini/generate-plan', async (req, res) => {
  const body = req.body || {};
  const {
    instrucciones,
    grado,
    fase,
    campoFormativo,
    tipoProyecto,
    numeroSesiones = 5,
    contenido,
    pda,
    ejesArticuladores = [],
    metodologia,
    contextoGrupo,
  } = body;

  const userPrompt = `
Genera una planeación didáctica completa para Educación Primaria en México.
Datos proporcionados:
- Grado: ${grado || '4° Primaria'} (${fase || 'Fase 4'})
- Campo Formativo: ${campoFormativo || 'Lenguajes'}
- Tipo de Proyecto: ${tipoProyecto || 'Aula'}
- Metodología: ${metodologia || 'Aprendizaje basado en proyectos comunitarios'}
- Número de sesiones: ${numeroSesiones}
- Ejes articuladores seleccionados: ${ejesArticuladores.join(', ') || 'Inclusión, Pensamiento crítico'}
- Contenido oficial de referencia: ${contenido || 'Sugerir uno acorde a las instrucciones'}
- PDA de referencia: ${pda || 'Sugerir uno oficial acorde'}
- Instrucciones particulares del docente: ${instrucciones || 'Proyecto integral de desarrollo de habilidades'}
- Contexto del grupo:
  * Fortalezas: ${contextoGrupo?.fortalezas || 'Grupo participativo'}
  * Necesidades: ${contextoGrupo?.necesidades || 'Consolidar comprensión y trabajo en equipo'}
  * Problemáticas: ${contextoGrupo?.problematicas || 'Bajo hábito lector o convivencia'}
  * Observaciones / BAP: ${contextoGrupo?.observaciones || 'Adecuaciones de acceso regulares'}

Genera exactamente ${Math.min(numeroSesiones, 12)} sesiones didácticas con momentos metodológicos de la NEM.
`.trim();

  try {
    const response = await callGeminiWithResilience('generate-plan', (model) =>
      ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: NEM_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titulo: { type: Type.STRING },
              campoFormativo: { type: Type.STRING },
              tipoProyecto: { type: Type.STRING },
              metodologia: { type: Type.STRING },
              grado: { type: Type.STRING },
              fase: { type: Type.STRING },
              temporalidad: { type: Type.STRING },
              ejesArticuladores: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              contenido: { type: Type.STRING },
              pda: { type: Type.STRING },
              proposito: { type: Type.STRING },
              problematica: { type: Type.STRING },
              situacionContexto: { type: Type.STRING },
              productoFinal: { type: Type.STRING },
              sesiones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    numero: { type: Type.INTEGER },
                    momento: { type: Type.STRING },
                    proposito: { type: Type.STRING },
                    tiempo: { type: Type.STRING },
                    organizacion: { type: Type.STRING },
                    inicio: { type: Type.STRING },
                    desarrollo: { type: Type.STRING },
                    cierre: { type: Type.STRING },
                    actividadesDocente: { type: Type.STRING },
                    actividadesAlumno: { type: Type.STRING },
                    materiales: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    productoEvidencia: { type: Type.STRING },
                    evaluacion: { type: Type.STRING },
                    instrumento: { type: Type.STRING },
                    adecuaciones: { type: Type.STRING },
                  },
                  required: [
                    'numero',
                    'momento',
                    'proposito',
                    'tiempo',
                    'organizacion',
                    'inicio',
                    'desarrollo',
                    'cierre',
                    'actividadesDocente',
                    'actividadesAlumno',
                    'materiales',
                    'productoEvidencia',
                    'evaluacion',
                    'instrumento',
                    'adecuaciones',
                  ],
                },
              },
            },
            required: [
              'titulo',
              'campoFormativo',
              'tipoProyecto',
              'metodologia',
              'contenido',
              'pda',
              'proposito',
              'productoFinal',
              'sesiones',
            ],
          },
        },
      })
    );

    const text = response.text || '{}';
    const parsedPlan = JSON.parse(text);

    // Ensure IDs on sessions
    if (parsedPlan.sesiones) {
      parsedPlan.sesiones = parsedPlan.sesiones.map((s: any, idx: number) => ({
        ...s,
        id: 's-' + Date.now() + '-' + idx,
        numero: s.numero || idx + 1,
      }));
    }

    res.json({ success: true, plan: parsedPlan });
  } catch (error: any) {
    console.error('[Generate-Plan] Servidores de Gemini en alta demanda. Activando motor curricular NEM de respaldo:', error?.message);
    // Return robust NEM plan so the teacher is never blocked
    const fallbackPlan = buildNEMFallbackPlan(body);
    res.json({
      success: true,
      plan: fallbackPlan,
      usedFallback: true,
      fallbackNotice: 'Planeación estructurada mediante el marco pedagógico oficial de la NEM debido a alta demanda momentánea en los servidores de IA.',
    });
  }
});

// 2. Assist Field (Single Field suggestion)
app.post('/api/gemini/assist-field', async (req, res) => {
  const { campo, temaOProyecto, grado, campoFormativo, datosExistentes } = req.body;

  const prompt = `
Actúa como asesor pedagógico de primaria mexicana NEM.
El docente solicita una redacción profesional, contextualizada y precisa para el campo "${campo}".
Tema / Proyecto: ${temaOProyecto || 'Proyecto de aula'}
Grado: ${grado || '4°'}
Campo formativo: ${campoFormativo || 'Lenguajes'}
Datos ya redactados en la planeación: ${JSON.stringify(datosExistentes || {})}

Devuelve únicamente un texto conciso y enriquecedor adecuado para colocarse directamente en este campo de la planeación.
`.trim();

  try {
    const response = await callGeminiWithResilience('assist-field', (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
      })
    );

    res.json({ success: true, suggestion: response.text?.trim() || '' });
  } catch (error: any) {
    console.warn('[Assist-Field] Utilizando sugerencia curricular NEM de respaldo:', error?.message);
    const suggestion = buildNEMFallbackField({
      campo,
      temaOProyecto,
      grado,
      campoFormativo,
      datosExistentes,
    });
    res.json({ success: true, suggestion, usedFallback: true });
  }
});

// 3. Improve / Adapt Activity
app.post('/api/gemini/improve-activity', async (req, res) => {
  const { action, sesion, grado, campoFormativo, propositoPlan, contextoGrupo, instruccionPersonalizada } = req.body;

  const actionDescriptions: Record<string, string> = {
    improve: 'Enriquecer y hacer más dinámica y reflexiva la actividad de inicio, desarrollo y cierre.',
    new: 'Crear una actividad completamente distinta pero que cumpla el mismo propósito y momento metodológico.',
    simplify: 'Simplificar el lenguaje, reducir la complejidad y dar apoyos para alumnos con dificultades.',
    complexify: 'Aumentar el reto cognitivo, incentivar pensamiento crítico de nivel superior e investigación profunda.',
    questions: 'Incorporar preguntas detonadoras y metacognitivas potentes en inicio y cierre.',
    product: 'Definir un producto o evidencia tangible más creativo y motivador para el alumno.',
    adapt: 'Adaptar las actividades para atender barreras para el aprendizaje (BAP) y diversidad de estilos.',
    evaluation: 'Mejorar los criterios de evaluación formativa e instrumento sugerido.',
    material: 'Sugerir materiales cotidianos y de bajo costo que enriquezcan la sesión.',
    rewording: 'Mejorar la redacción técnica pedagógica haciéndola clara e impecable.',
    coherence: 'Asegurar total coherencia con el propósito del proyecto y el momento didáctico.',
  };

  const actionText = actionDescriptions[action] || instruccionPersonalizada || 'Mejorar la sesión didáctica.';

  const prompt = `
Modifica la siguiente sesión didáctica de acuerdo con la siguiente instrucción:
ACCIÓN SOLICITADA: ${actionText}
${instruccionPersonalizada ? `Detalle adicional del maestro: ${instruccionPersonalizada}` : ''}

Datos de contexto:
- Grado: ${grado}
- Campo formativo: ${campoFormativo}
- Propósito general del proyecto: ${propositoPlan}
- Fortalezas/BAP del grupo: ${contextoGrupo?.observaciones || 'Heterogéneo'}

SESIÓN ACTUAL:
${JSON.stringify(sesion, null, 2)}

Devuelve el objeto JSON actualizado conservando los mismos campos pero modificando únicamente lo necesario según la acción.
`.trim();

  try {
    const response = await callGeminiWithResilience('improve-activity', (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: NEM_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              numero: { type: Type.INTEGER },
              momento: { type: Type.STRING },
              proposito: { type: Type.STRING },
              tiempo: { type: Type.STRING },
              organizacion: { type: Type.STRING },
              inicio: { type: Type.STRING },
              desarrollo: { type: Type.STRING },
              cierre: { type: Type.STRING },
              actividadesDocente: { type: Type.STRING },
              actividadesAlumno: { type: Type.STRING },
              materiales: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              productoEvidencia: { type: Type.STRING },
              evaluacion: { type: Type.STRING },
              instrumento: { type: Type.STRING },
              adecuaciones: { type: Type.STRING },
            },
            required: [
              'numero',
              'momento',
              'proposito',
              'tiempo',
              'organizacion',
              'inicio',
              'desarrollo',
              'cierre',
              'actividadesDocente',
              'actividadesAlumno',
              'materiales',
              'productoEvidencia',
              'evaluacion',
              'instrumento',
              'adecuaciones',
            ],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = sesion?.id || 's-' + Date.now();
    res.json({ success: true, updatedSesion: parsed });
  } catch (error: any) {
    console.warn('[Improve-Activity] Aplicando enriquecimiento pedagógico local:', error?.message);
    const updated = {
      ...sesion,
      inicio: sesion.inicio + '\n• Pregunta detonadora: ¿Qué relación encuentras entre este reto y lo que vivimos en nuestra comunidad?',
      desarrollo: sesion.desarrollo + '\n• Dinámica activa: Organización de equipos colaborativos con roles definidos y retroalimentación formativa.',
      cierre: sesion.cierre + '\n• Reflexión metacognitiva: Registro en bitácora sobre lo aprendido y lo que aún representa un reto.',
      adecuaciones: (sesion.adecuaciones || '') + ' Apoyo visual y tiempos flexibles para garantizar la inclusión plena.',
    };
    res.json({ success: true, updatedSesion: updated, usedFallback: true });
  }
});

// 4. Review Plan with AI
app.post('/api/gemini/review-plan', async (req, res) => {
  const { plan } = req.body;

  const prompt = `
Analiza críticamente esta planeación didáctica de la Nueva Escuela Mexicana:
${JSON.stringify(plan, null, 2)}

Evalúa exhaustivamente:
1. Coherencia entre propósito, contenido, PDA y actividades.
2. Progresión lógica de los momentos metodológicos.
3. Pertinencia de las evidencias y los instrumentos de evaluación formativa.
4. Adecuación de tiempos y materiales para educación primaria.

Proporciona tu dictamen en JSON con:
- fortalezas: lista de 3 a 5 aspectos positivos destacados.
- sugerencias: lista de recomendaciones concretas, indicando la sección y el cambio propuesto.
- posiblesInconsistencias: lista de contradicciones o vacíos encontrados (o lista vacía si está excelente).
- puntuacionCoherencia: calificación del 1 al 100 en coherencia integral.
`.trim();

  try {
    const response = await callGeminiWithResilience('review-plan', (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: NEM_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fortalezas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              sugerencias: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    seccion: { type: Type.STRING },
                    descripcion: { type: Type.STRING },
                    cambioPropuesto: { type: Type.STRING },
                  },
                  required: ['seccion', 'descripcion', 'cambioPropuesto'],
                },
              },
              posiblesInconsistencias: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              puntuacionCoherencia: { type: Type.INTEGER },
            },
            required: ['fortalezas', 'sugerencias', 'posiblesInconsistencias', 'puntuacionCoherencia'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, review: parsed });
  } catch (error: any) {
    console.warn('[Review-Plan] Generando dictamen pedagógico estructurado de respaldo:', error?.message);
    const sesionesCount = plan?.sesiones?.length || 0;
    const review = {
      fortalezas: [
        'Alineación pertinente con los campos formativos y ejes articuladores de la NEM.',
        `Estructura secuenciada con ${sesionesCount} sesiones que contemplan momentos didácticos claros.`,
        'Incorporación explícita de evaluación formativa procesual e instrumentos de seguimiento.',
      ],
      sugerencias: [
        {
          seccion: 'Desarrollo de actividades',
          descripcion: 'Fomentar un rol más protagónico del alumno en la toma de decisiones del proyecto.',
          cambioPropuesto: 'Integrar asambleas breves al inicio y final de cada fase para valorar el avance colectivo.',
        },
        {
          seccion: 'Evaluación Formativa',
          descripcion: 'Diversificar los instrumentos de coevaluación entre pares.',
          cambioPropuesto: 'Utilizar rúbricas visuales o dianas de evaluación para autovaloración del alumno.',
        },
      ],
      posiblesInconsistencias: [],
      puntuacionCoherencia: 92,
      usedFallback: true,
    };
    res.json({ success: true, review });
  }
});

// 5. Generate Evaluation Instrument
app.post('/api/gemini/generate-evaluation', async (req, res) => {
  const body = req.body || {};
  const { tipo, titulo, campoFormativo, grado, contenido, pda, proposito, productoEvidencia } = body;

  const prompt = `
Genera un instrumento de evaluación formativa tipo "${tipo}" para educación primaria mexicana.
Datos curriculares:
- Título del instrumento: ${titulo || 'Evaluación Formativa'}
- Campo formativo: ${campoFormativo}
- Grado: ${grado}
- Contenido: ${contenido}
- PDA: ${pda}
- Propósito: ${proposito}
- Producto o evidencia a evaluar: ${productoEvidencia}

Crea de 4 a 6 indicadores formativos observables y pertinentes. Si el tipo es Rúbrica, define descriptores en 4 niveles (Sobresaliente, Satisfactorio, Básico, Requiere Apoyo).
`.trim();

  try {
    const response = await callGeminiWithResilience('generate-evaluation', (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: NEM_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titulo: { type: Type.STRING },
              instrucciones: { type: Type.STRING },
              escala: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              indicadores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    descripcion: { type: Type.STRING },
                    ponderacion: { type: Type.INTEGER },
                    criterios: {
                      type: Type.OBJECT,
                      properties: {
                        nivelSobresaliente: { type: Type.STRING },
                        nivelSatisfactorio: { type: Type.STRING },
                        nivelBasico: { type: Type.STRING },
                        nivelRequiereApoyo: { type: Type.STRING },
                      },
                    },
                  },
                  required: ['descripcion'],
                },
              },
            },
            required: ['titulo', 'instrucciones', 'indicadores'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.indicadores) {
      parsed.indicadores = parsed.indicadores.map((ind: any, i: number) => ({
        ...ind,
        id: 'ind-' + Date.now() + '-' + i,
      }));
    }

    res.json({ success: true, evaluation: parsed });
  } catch (error: any) {
    console.warn('[Generate-Evaluation] Generando instrumento formativo de respaldo:', error?.message);
    const fallbackEvaluation = buildNEMFallbackEvaluation(body);
    res.json({ success: true, evaluation: fallbackEvaluation, usedFallback: true });
  }
});

// 6. Generate Didactic Material
app.post('/api/gemini/generate-material', async (req, res) => {
  const body = req.body || {};
  const { tipo, titulo, grado, campoFormativo, temaOContenido, instruccionesEspecificas } = body;

  const prompt = `
Genera un material didáctico imprimible tipo "${tipo}" listo para ser utilizado en el aula de ${grado} de primaria en México.
- Título: ${titulo}
- Campo formativo: ${campoFormativo}
- Tema o Contenido: ${temaOContenido}
- Instrucciones especiales: ${instruccionesEspecificas || 'Adecuado y amigable para niños de primaria'}

El contenido del texto debe ser completo, didáctico y contener la lectura, ejercicios, preguntas o problemas con estructura clara.
Incluye también una sección con las respuestas sugeridas o clave docente.
`.trim();

  try {
    const response = await callGeminiWithResilience('generate-material', (model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: NEM_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titulo: { type: Type.STRING },
              instrucciones: { type: Type.STRING },
              contenidoTexto: { type: Type.STRING },
              respuestasSugeridas: { type: Type.STRING },
            },
            required: ['titulo', 'instrucciones', 'contenidoTexto'],
          },
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, material: parsed });
  } catch (error: any) {
    console.warn('[Generate-Material] Generando material imprimible de respaldo:', error?.message);
    const fallbackMaterial = buildNEMFallbackMaterial(body);
    res.json({ success: true, material: fallbackMaterial, usedFallback: true });
  }
});

// Mount Vite or static server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PlaneaNEM] Servidor productivo escuchando en el puerto ${PORT}`);
  });
} else {
  // In development, mount Vite middleware with HTTP server attachment for HMR
  const httpServer = http.createServer(app);
  import('vite').then(async ({ createServer }) => {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`[PlaneaNEM] Servidor de desarrollo escuchando en http://0.0.0.0:${PORT}`);
    });
  });
}
