import CONFIG from "../../config";
import cors from "cors";
import express, { Router } from "express";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { OpenApiValidator } from "express-openapi-validate";
import fs from "fs";

export class FileUtility {
  static get(filePath: string) {
    const file = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(file);
  }
}

const ValidatorRouter = Router();

ValidatorRouter.use(
  CONFIG.OAS.PATH,
  swaggerUi.serve,
  swaggerUi.setup(FileUtility.get(CONFIG.OAS.FILE))
);

[
  cors({}),
  morgan("tiny"),
  express.json(),
  express.static(path.join(__dirname, CONFIG.RESOURCE)),
  new OpenApiValidator(FileUtility.get(CONFIG.OAS.FILE)).match(),
].forEach((middleware) => ValidatorRouter.use(CONFIG.CONTEXT, middleware));

export { ValidatorRouter };
