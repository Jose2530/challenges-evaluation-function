import { NextFunction, Request, Response } from "express";

import { DynamoDBQuestionRepository } from "../repositories/dynamodb-question.repository";
import { dynamoDBDocumentClient } from "../config/dynamoDB";
import CONFIG from "../../config";

import { CreateQuestionService } from "../../application/services/questions/question.service";
import { ListQuestionsService } from "../../application/services/questions/listQuestions.service";
import { GetQuestionService } from "../../application/services/questions/getQuestion.service";

const questionRepository = new DynamoDBQuestionRepository(
  dynamoDBDocumentClient,
  CONFIG.DYNAMODB.QUESTIONS_TABLE
);

const createQuestionService = new CreateQuestionService(questionRepository);

const listQuestionsService = new ListQuestionsService(questionRepository);

const getQuestionService = new GetQuestionService(questionRepository);

export class QuestionController {
  public static async createQuestion(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await createQuestionService.query({
      body: req.body,
      headers: req.headers,
    });

    return res.status(result.status).json(result);
  }

  public static async listQuestion(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await listQuestionsService.query({
      headers: req.headers,
      body: req.body,
      query: req.query as { challengeType?: string },
    });

    return res.status(result.status).json(result);
  }

  public static async getByIdQuestion(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await getQuestionService.query({
      headers: req.headers,
      body: {
        id: req.params.id,
      },
    });

    return res.status(result.status).json(result);
  }
}
