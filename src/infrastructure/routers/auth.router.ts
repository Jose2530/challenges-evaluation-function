import express from "express";

import CONFIG from "../../config";
import { AuthController } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.AUTHENTICATION}`,
  AuthController.login
);

authRouter.post(
  `${CONFIG.CONTEXT}${CONFIG.PATHS.OPERATIONS.AUTHENTICATION_REGISTRATION}`,
  AuthController.register
);

export { authRouter };
