import express from "express";
import CONFIG from "../../config";
import { AssessmentController } from "../controllers/assessment.controller";

const assessmentRouter = express.Router();

assessmentRouter.post(
  `${CONFIG.PATHS.OPERATIONS.ASSESSMENTS}`,
  AssessmentController.create
);

assessmentRouter.get(
  `${CONFIG.PATHS.OPERATIONS.ASSESSMENTS_LIST}`,
  AssessmentController.list
);

assessmentRouter.get(
  `${CONFIG.PATHS.OPERATIONS.ASSESSMENT_BY_ID}`,
  AssessmentController.getById
);

export { assessmentRouter };
