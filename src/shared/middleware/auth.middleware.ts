import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import CONFIG from "../../config";

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    userType: "admin" | "candidate";
    name: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: 401,
      message: "Token requerido.",
    });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = (verify as any)(token, String(CONFIG.JWT.SECRET)) as {
      sub: string;
      email: string;
      userType: "admin" | "candidate";
      name: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Token inválido o expirado.",
    });
  }
};
