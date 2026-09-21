import { Request, Response, NextFunction } from "express";

import { EvaluateQuestionService } from "../../application/services/evaluation/evaluateQuestion.service";
import { ExecuteCodeService } from "../../application/services/execution/execution.service";
import { EvaluateAssessmentService } from "../../application/services/evaluation/evaluateAssessment.service";
import { DynamoDBQuestionRepository } from "../../infrastructure/repositories/dynamodb-question.repository";
import { DynamoDBAssessmentRepository } from "../../infrastructure/repositories/dynamodb-assessment.repository";
import { dynamoDBDocumentClient } from "../config/dynamoDB";
import CONFIG from "../../config";
import { DynamoDBEvaluationRepository } from "../../infrastructure/repositories/dynamodb-evaluation.repository";
import { GetEvaluationService } from "../../application/services/evaluation/getEvaluation.service";
import { ListEvaluationService } from "../../application/services/evaluation/listEvaluation.service";
import { EvaluateChallengeService } from "../../application/services/ia/evaluateChallenge.service";
import { GroqService } from "../../application/services/ia/groq.service";

const aiService = new GroqService();

const dynamoDBQuestionRepository = new DynamoDBQuestionRepository(
  dynamoDBDocumentClient,
  CONFIG.DYNAMODB.QUESTIONS_TABLE
);

const dynamoDBAssessmentRepository = new DynamoDBAssessmentRepository();

const executeCodeService = new ExecuteCodeService();

const evaluateQuestionService = new EvaluateQuestionService(executeCodeService);

const evaluationRepository = new DynamoDBEvaluationRepository(
  dynamoDBDocumentClient,
  CONFIG.DYNAMODB.CHALLENGE_EVALUATION
);

const evaluateAssessmentService = new EvaluateAssessmentService(
  dynamoDBAssessmentRepository,
  dynamoDBQuestionRepository,
  evaluateQuestionService,
  evaluationRepository
);

const getEvaluationService = new GetEvaluationService(evaluationRepository);

const listEvaluationService = new ListEvaluationService(evaluationRepository);

const evaluateChallengeService = new EvaluateChallengeService(aiService);

export class EvaluateQuestionController {
  public static async evaluate(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    console.log("::::::dos", req.body);
    const result = await evaluateChallengeService.query({
      body: req.body,
      headers: req.headers,
    });
    return res.status(result.status).json(result);
  }

  public static async evaluateAssessment(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    try {
      const result = await evaluateAssessmentService.query({
        assessmentId: req.body.assessmentId,
        codeByQuestion: req.body.codeByQuestion,
        language: req.body.language,
      });

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(400).json({
        status: 400,
        data: {
          status: "INVALID_LANGUAGE",
          message:
            error instanceof Error
              ? error.message
              : "Invalid execution request",
        },
      });
    }
  }

  public static async getEvaluateAssessment(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await getEvaluationService.query({
      body: {
        id: req.params.id,
      },
      headers: req.headers,
    });

    return res.status(result.status).json(result);
  }

  public static async ListGetEvaluateAssessment(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await listEvaluationService.query({
      headers: req.headers,
    });

    return res.status(result.status).json(result);
  }
}
