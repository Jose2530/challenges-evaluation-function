import express from "express";

import CONFIG from "../../config";
import { EvaluateQuestionController } from "../controllers/evaluateQuestion.controller";

const evaluationRouter = express.Router();

evaluationRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.EVALUATIONS}`,
  EvaluateQuestionController.evaluate
);

evaluationRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.EVALUATIONS_ASSESSMENT}`,
  EvaluateQuestionController.evaluateAssessment
);
evaluationRouter.get(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.EVALUATIONS_LIST}`,
  EvaluateQuestionController.ListGetEvaluateAssessment
);

evaluationRouter.get(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.EVALUATIONS_BY_ID}`,
  EvaluateQuestionController.getEvaluateAssessment
);

export { evaluationRouter };
