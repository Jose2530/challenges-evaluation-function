import express from "express";

import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";

const candidateRouter = express.Router();

candidateRouter.use(authMiddleware);
candidateRouter.use(requireRole(["candidate"]));

export { candidateRouter };
