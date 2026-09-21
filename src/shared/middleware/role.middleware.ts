import { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "./auth.middleware";

export const requireRole = (allowedRoles: Array<"admin" | "candidate">) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const userType = req.user?.userType;

    if (!userType || !allowedRoles.includes(userType)) {
      res.status(403).json({
        status: 403,
        message: "No tienes permisos para acceder a este recurso.",
      });
      return;
    }

    next();
  };
};
