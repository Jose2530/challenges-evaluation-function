import express from "express";
import CONFIG from "../../config";
import { QuestionController } from "../controllers/question.controller";

const questionRouter = express.Router();

questionRouter.post(
  `${CONFIG.PATHS.OPERATIONS.QUESTIONS}`,
  QuestionController.createQuestion
);

questionRouter.get(
  `${CONFIG.PATHS.OPERATIONS.QUESTIONS_LIST}`,
  QuestionController.listQuestion
);

questionRouter.get(
  `${CONFIG.PATHS.OPERATIONS.QUESTION_BY_ID}`,
  QuestionController.getByIdQuestion
);

export { questionRouter };
