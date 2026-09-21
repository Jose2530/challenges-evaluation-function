import { NextFunction, Request, Response } from "express";

import { LoginService } from "../../application/services/auth/login.service";
import { RegisterService } from "../../application/services/auth/register.service";
import { DynamoDBUserRepository } from "../repositories/dynamodb-user.repository";
import { dynamoDBDocumentClient } from "../config/dynamoDB";
import CONFIG from "../../config";

const userRepository = new DynamoDBUserRepository(
  dynamoDBDocumentClient,
  CONFIG.DYNAMODB.USERS_TABLE
);

const loginService = new LoginService(userRepository);
const registerService = new RegisterService(userRepository);

export class AuthController {
  public static async login(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    try {
      const result = await loginService.query({
        body: req.body,
        headers: req.headers,
      });

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error instanceof Error ? error.message : "Login error",
      });
    }
  }

  public static async register(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    try {
      const result = await registerService.query({
        body: req.body,
        headers: req.headers,
      });

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error instanceof Error ? error.message : "Register error",
      });
    }
  }
}
