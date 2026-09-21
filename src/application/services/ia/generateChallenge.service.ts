import {
  GenerateChallengeRequest,
  GeneratedChallenge,
} from "../../../domain/ai/generateChallenge.model";
import { AIService } from "./ia.service";

interface GenerateChallengeResponse {
  status: number;
  data: GeneratedChallenge;
}

class GenerateChallengeService {
  constructor(private readonly aiService: AIService) {}

  public async query(
    request: GenerateChallengeRequest
  ): Promise<GenerateChallengeResponse> {
    const prompt = `
Genera un ejercicio de programación corto para una plataforma de evaluación técnica.

Tema:
${request.topic}

Nivel del candidato:
${request.difficulty}

Lenguaje:
${request.language}

El nivel del candidato es OBLIGATORIO y debe determinar la complejidad
del ejercicio.

NIVELES:

facil:
- Evalúa fundamentos de programación.
- Variables, condicionales, ciclos, funciones y estructuras básicas.
- Problemas simples y directos.
- No requiere algoritmos avanzados.
- Debe poder resolverse aproximadamente en 5 minutos.

intermedio:
- Evalúa resolución de problemas y manejo de estructuras de datos.
- Puede requerir arrays, objetos, mapas, sets, búsqueda, ordenamiento
  o manipulación de strings.
- Puede requerir elegir una estrategia algorítmica.
- Debe poder resolverse aproximadamente en 10 minutos.


REGLAS GENERALES:

- Evalúa UNA sola habilidad principal.
- El ejercicio debe ser corto.
- Debe poder resolverse directamente en un editor de código.
- No requiere múltiples archivos.
- No requiere librerías externas.
- No requiere internet.
- No requiere base de datos.
- No requiere interfaz gráfica.
- No incluyas la solución.
- No incluyas código de solución.
- No incluyas test cases.
- No incluyas explicaciones adicionales.
- La descripción debe ser breve y clara.
- No escribas texto fuera del JSON.
- El reto solo puede estar en español

La descripción debe indicar:
1. Qué debe hacer el candidato.
2. Qué recibe como entrada.
3. Qué debe devolver como salida.

RESPONDE ÚNICAMENTE CON JSON VÁLIDO:

{
  "title": "string",
  "description": "string",
  "difficulty": "${request.difficulty}",
  "score": number,
  "allowedLanguages": ["${request.language}"]
}

El score debe ser:
- Junior: 5-10
- Middle: 10-15
- Senior: 15-20
`;

    const response = await this.aiService.generate(prompt);
    console.log("🤖 AI RESPONSE:", response);
    const challenge = JSON.parse(response);

    try {
      return {
        status: 200,
        data: challenge,
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

export { GenerateChallengeService };
