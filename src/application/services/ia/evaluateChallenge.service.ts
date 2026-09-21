import {
  EvaluateChallengeRequest,
  EvaluateChallengeResponseData,
} from "../../../domain/evaluation/evaluationResponse.model";

import { AIService } from "./ia.service";

interface EvaluateChallengeResponse {
  status: number;
  data: EvaluateChallengeResponseData;
}

class EvaluateChallengeService {
  constructor(private readonly aiService: AIService) {}

  public async query(
    request: EvaluateChallengeRequest
  ): Promise<EvaluateChallengeResponse> {
    const { exercises } = request.body;

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return {
        status: 400,
        data: {
          evaluations: [],
          summary: {
            totalExercises: 0,
            averageScore: 0,
          },
        },
      };
    }

    const exercisesPrompt = exercises
      .map(
        (item, index) => `
EJERCICIO ${index + 1}

Título:
${item.exercise.question.title}

Descripción:
${item.exercise.question.description}

Dificultad:
${item.exercise.question.difficulty}

Lenguaje:
${item.candidate.language}

CÓDIGO DEL CANDIDATO:
${item.candidate.code}
`
      )
      .join("\n-----------------------------\n");

    const prompt = `
Eres un evaluador técnico especializado en programación.

Debes evaluar las soluciones proporcionadas por un candidato.

${exercisesPrompt}

CRITERIOS DE EVALUACIÓN:

1. Correctitud
- Determina si la solución cumple con el requerimiento.
- Analiza la lógica implementada.
- Verifica si la solución resuelve correctamente el problema.

2. Casos de prueba
- Analiza diferentes escenarios de entrada según el ejercicio.
- Incluye casos normales.
- Incluye casos límite.
- Incluye arrays vacíos cuando corresponda.
- Incluye valores negativos cuando corresponda.
- Incluye valores repetidos cuando corresponda.
- Incluye valores extremos cuando corresponda.

REGLAS:

- Evalúa cada ejercicio individualmente.
- El score debe estar entre 0 y 100.
- No ejecutes realmente el código.
- No inventes resultados de ejecución.
- Basa la evaluación únicamente en el ejercicio y el código proporcionado.
- No incluyas feedback.
- No incluyas recomendaciones.
- No incluyas explicaciones adicionales.
- Responde únicamente con JSON válido.

Debes estimar cuántos escenarios de prueba serían exitosos
y cuántos serían fallidos según el análisis de la solución.

El score debe representar el porcentaje estimado de escenarios
resueltos correctamente.

Por ejemplo:

10 escenarios
8 exitosos
2 fallidos
score = 80

RESPONDE EXACTAMENTE CON ESTA ESTRUCTURA:

{
  "evaluations": [
    {
      "exerciseIndex": 0,
      "successfulTests": 0,
      "failedTests": 0,
      "score": 0
    }
  ],
  "summary": {
    "totalExercises": 0,
    "successfulTests": 0,
    "failedTests": 0,
    "averageScore": 0
  }
}

IMPORTANTE:

- exerciseIndex comienza en 0.
- Debe existir exactamente una evaluación por cada ejercicio.
- successfulTests debe ser un número entero.
- failedTests debe ser un número entero.
- successfulTests + failedTests debe representar el total de escenarios analizados.
- El score debe estar entre 0 y 100.
- averageScore debe ser el promedio de los scores de todos los ejercicios.
`;

    const response = await this.aiService.generate(prompt);

    console.log("🤖 AI EVALUATION:", response);

    try {
      const evaluation: EvaluateChallengeResponseData = JSON.parse(response);

      return {
        status: 200,
        data: evaluation,
      };
    } catch (error) {
      console.error("❌ Error parseando respuesta de IA:", error);

      console.error("❌ Respuesta recibida:", response);

      throw new Error(
        "La IA devolvió una respuesta que no tiene un JSON válido"
      );
    }
  }
}

export { EvaluateChallengeService };
