import express from "express";
import { HintController } from "../controllers/hint.controller";
import CONFIG from "../../config";
import { GenerateChallengeController } from "../controllers/generateChallenge.controller";

const aiRouter = express.Router();

aiRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.AI_HINT}`,
  HintController.generate
);

aiRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.AI_GENERATE}`,
  GenerateChallengeController.generate
);

export { aiRouter };
