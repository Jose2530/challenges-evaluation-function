import { ExecutionRequest } from "./execution-request";
import { ExecutionResult } from "./execution-result";

export interface ExecutionEngine {
  execute(request: ExecutionRequest): Promise<ExecutionResult>;
}
