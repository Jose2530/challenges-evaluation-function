import express from "express";
import CONFIG from "../../config";
import { submissionController } from "../controllers/submission.controller";

const submissionRouter = express.Router();

submissionRouter.post(
  `${CONFIG.PATHS.OPERATIONS.SUBMISSIONS}`,
  submissionController.submissionPostRequest
);

export { submissionRouter };
