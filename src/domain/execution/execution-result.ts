export type ExecutionStatus =
  | "SUCCESS"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "TIMEOUT"
  | "EXECUTION_ERROR";

export interface ExecutionResult {
  status: ExecutionStatus;
  output: string;
  error?: string;
  executionTimeMs: number;
}
