import CONFIG from "../../config";
import { Router } from "express";
import { assessmentRouter } from "./assessment.router";
import { questionRouter } from "./question.router";
import { submissionRouter } from "./submission.router";
import { executionRouter } from "./execution.router";
import { evaluationRouter } from "./evaluation.router";
import { authRouter } from "./auth.router";
import { aiRouter } from "./ia.router";

const AppRouter = Router();

[
  authRouter,
  assessmentRouter,
  questionRouter,
  submissionRouter,
  executionRouter,
  evaluationRouter,
  aiRouter,
].forEach((route: Router) => AppRouter.use(CONFIG.CONTEXT, route));

export { AppRouter };
