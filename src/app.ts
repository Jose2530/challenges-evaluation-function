import express from "express";
import { ValidatorRouter } from "./infrastructure/routers/validator.router";
import { AppRouter } from "./infrastructure/routers/app.router";

const app = express();
app.disable("x-powered-by");
app.use(ValidatorRouter);
app.use(AppRouter);

export default app;
