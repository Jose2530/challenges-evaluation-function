import { NextFunction, Request, Response } from "express";
import { ExecuteCodeService } from "../../application/services/execution/execution.service";
import { DynamoDBExecutionRepository } from "../repositories/dynamodb-execution.repository";
import { dynamoDBDocumentClient } from "../config/dynamoDB";
import CONFIG from "../../config";
import { AuthenticatedRequest } from "../../shared/middleware/auth.middleware";

const executeCodeService = new ExecuteCodeService(
  new DynamoDBExecutionRepository(
    dynamoDBDocumentClient,
    CONFIG.DYNAMODB.CHALLENGE_EVALUATION
  )
);

export class ExecutionController {
  public static async execute(
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    try {
      const result = await executeCodeService.query({
        body: req.body,
        headers: req.headers,
        userId: req.user?.sub,
      });

      return res.status(result.status).json(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Execution request failed";
      const isUnsupportedLanguage = message.startsWith("Unsupported language:");

      const responseStatus = isUnsupportedLanguage ? 400 : 500;

      return res.status(responseStatus).json({
        status: responseStatus,
        data: {
          status: isUnsupportedLanguage
            ? "INVALID_LANGUAGE"
            : "EXECUTION_ERROR",
          message,
        },
      });
    }
  }
}
