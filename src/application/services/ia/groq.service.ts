import Groq from "groq-sdk";

import CONFIG from "../../../config";
import { AIService } from "./ia.service";

class GroqService implements AIService {
  private readonly client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: CONFIG.AI.GROQ_API_KEY,
    });
  }

  public async generate(prompt: string): Promise<string> {
    try {
      console.log("🤖 Groq model:", CONFIG.AI.MODEL);

      const response = await this.client.chat.completions.create({
        model: CONFIG.AI.MODEL,
        messages: [
          {
            role: "system",
            content:
              "Eres un asistente de una plataforma de evaluaciones técnicas.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });

      console.log("🤖 Groq response:", JSON.stringify(response, null, 2));

      const content = response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Groq no devolvió contenido");
      }

      return content.trim();
    } catch (error) {
      console.error("❌ ERROR REAL DE GROQ:", error);

      throw error;
    }
  }
}

export { GroqService };
