import { AIService } from "../ia/ia.service";

interface GenerateHintRequest {
  questionDescription: string;
  language: string;
  code: string;
}

interface GenerateHintResponse {
  status: number;
  data: {
    guidance: string;
  };
}

class GenerateHintService {
  constructor(private readonly aiService: AIService) {}

  public async query(
    request: GenerateHintRequest
  ): Promise<GenerateHintResponse> {
    const { questionDescription, language, code } = request;

    const prompt = `
You are a programming mentor.

Give the candidate ONE short hint to help them solve the problem.

STRICT RULES:
- Response only in spanish 
- Never provide code.
- Never provide the solution.
- Never show the correct operator, algorithm, function, or implementation.
- Never rewrite or modify the candidate's code.
- Never provide input/output examples.
- Do not mention hidden tests.
- Do not tell the candidate exactly what to change.
- Ask the candidate to think about the relevant concept.
- Maximum 2 sentences.
- Maximum 40 words.
- Respond only with the hint.

Question:
${questionDescription}

Language:
${language}

Candidate code:
${code}
`;

    const guidance = await this.aiService.generate(prompt);

    return {
      status: 200,
      data: {
        guidance,
      },
    };
  }
}

export { GenerateHintService };
