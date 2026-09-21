import express from "express";
import CONFIG from "../../config";
import { ExecutionController } from "../controllers/execution.controller";
import { authMiddleware } from "../../shared/middleware/auth.middleware";

const executionRouter = express.Router();

executionRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.EXECUTIONS}`,
  authMiddleware,
  ExecutionController.execute
);

export { executionRouter };
