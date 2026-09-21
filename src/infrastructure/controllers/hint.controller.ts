import { Request, Response, NextFunction } from "express";

import { GroqService } from "../../application/services/ia/groq.service";
import { GenerateHintService } from "../../application/services/ia/generateHint.service";

const aiService = new GroqService();

const generateHintService = new GenerateHintService(aiService);

export class HintController {
  public static async generate(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await generateHintService.query({
      questionDescription: req.body.questionDescription,
      language: req.body.language,
      code: req.body.code,
    });

    return res.status(result.status).json(result);
  }
}
