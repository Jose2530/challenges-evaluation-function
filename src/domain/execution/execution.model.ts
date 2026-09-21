import { SupportedLanguage } from "../../domain/questions/question";

export type ExecutionStatus =
  | "SUCCESS"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "TIMEOUT"
  | "EXECUTION_ERROR";

export interface ExecutionRequest {
  language: string;
  code: string;
  input: string;
}

export interface ExecutionResult {
  status: ExecutionStatus;
  output: string;
  error: string;
  executionTimeMs: number;
}

export interface ExecutionModel {
  id: string;
  userId?: string;
  code: string;
  language: SupportedLanguage;
  input: string;
  status: ExecutionStatus;
  output: string;
  error?: string;
  executionTimeMs: number;
  createdAt: string;
}

export type TestCaseStatus =
  | "PASSED"
  | "FAILED"
  | "TIMEOUT"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR";

export interface TestCaseResult {
  testCaseId: string;
  status: TestCaseStatus;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
}

export interface EvaluationResult {
  questionId: string;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  score: number;
  results: TestCaseResult[];
  guidance?: string;
}

interface EvaluateQuestionResponse {
  status: number;
  data: EvaluationResult;
}
