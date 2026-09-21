import express from "express";

import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { requireRole } from "../../shared/middleware/role.middleware";

const adminRouter = express.Router();

adminRouter.use(authMiddleware);
adminRouter.use(requireRole(["admin"]));

export { adminRouter };
