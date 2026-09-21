import { Request, Response, NextFunction } from "express";

import { AIService } from "../../application/services/ia/ia.service";
import { GenerateChallengeService } from "../../application/services/ia/generateChallenge.service";
import { GroqService } from "../../application/services/ia/groq.service";

const aiService = new GroqService();

const generateChallengeService = new GenerateChallengeService(aiService);

export class GenerateChallengeController {
  public static async generate(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await generateChallengeService.query({
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      language: req.body.language,
    });

    return res.status(result.status).json(result);
  }
}
