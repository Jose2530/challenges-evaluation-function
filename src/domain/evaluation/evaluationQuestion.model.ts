import { TestCaseResult } from "../../domain/execution/execution.model";

export interface EvaluationQuestionResult {
  questionId: string;
  score: number;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  results: TestCaseResult[];
}
