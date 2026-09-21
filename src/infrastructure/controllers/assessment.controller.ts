import { NextFunction, Request, Response } from "express";

import { DynamoDBAssessmentRepository } from "../repositories/dynamodb-assessment.repository";
import { CreateAssessmentService } from "../../application/services/assessment/assessment.service";
import { ListAssessmentsService } from "../../application/services/assessment/listAssessments.service";
import { GetAssessmentService } from "../../application/services/assessment/getAssessment.service";

const assessmentRepository = new DynamoDBAssessmentRepository();

const createAssessmentService = new CreateAssessmentService(
  assessmentRepository
);

const listAssessmentsService = new ListAssessmentsService(assessmentRepository);

const getAssessmentService = new GetAssessmentService(assessmentRepository);

export class AssessmentController {
  public static async create(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await createAssessmentService.query({
      body: req.body,
      headers: req.headers,
    });

    return res.status(result.status).json(result);
  }

  public static async list(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await listAssessmentsService.query({
      headers: req.headers,
    });

    return res.status(result.status).json(result);
  }

  public static async getById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const result = await getAssessmentService.query({
      body: {
        id: req.params.id,
      },
      headers: req.headers,
    });

    return res.status(result.status).json(result);
  }
}
