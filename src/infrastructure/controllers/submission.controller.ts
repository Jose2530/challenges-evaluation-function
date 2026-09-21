import { NextFunction, Request, Response } from "express";

export class submissionController {
  public static async submissionPostRequest(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    return res.status(200).json({ message: "Exito", data: "para que mas" });
  }
}
