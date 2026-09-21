import {
  EvaluationResult,
  TestCaseResult,
} from "../../../domain/execution/execution.model";
import {
  Question,
  SupportedLanguage,
} from "../../../domain/questions/question";
import { ExecuteCodeService } from "../execution/execution.service";

interface EvaluateQuestionRequest {
  question: Question;
  code: string;
  language: SupportedLanguage;
}

interface EvaluateQuestionResponse {
  status: number;
  data: EvaluationResult;
}

class EvaluateQuestionService {
  constructor(private readonly executeCodeService: ExecuteCodeService) {}

  public async query(
    request: EvaluateQuestionRequest
  ): Promise<EvaluateQuestionResponse> {
    const { question, code, language } = request;

    if (!question.allowedLanguages.includes(language)) {
      throw new Error(`Language ${language} is not allowed for this question`);
    }

    const results: TestCaseResult[] = [];

    for (const testCase of question.testCases) {
      const execution = await this.executeCodeService.query({
        body: {
          language,
          code,
          input: testCase.input,
        },
        headers: {},
      });

      const expectedOutput = this.normalizeOutput(testCase.expectedOutput);

      const actualOutput = this.normalizeOutput(execution.data.output);

      const passed =
        execution.data.status === "SUCCESS" && expectedOutput === actualOutput;

      results.push({
        testCaseId: testCase.id,
        status: passed
          ? "PASSED"
          : this.getTestCaseStatus(execution.data.status),
        expectedOutput,
        actualOutput,
        executionTimeMs: execution.data.executionTimeMs,
      });
    }

    const passedTestCases = results.filter(
      (result) => result.status === "PASSED"
    ).length;

    const totalTestCases = results.length;

    const score =
      totalTestCases === 0
        ? 0
        : (passedTestCases / totalTestCases) * question.score;

    return {
      status: 200,
      data: {
        questionId: question.id,
        totalTestCases,
        passedTestCases,
        failedTestCases: totalTestCases - passedTestCases,
        score,
        results,
      },
    };
  }

  private normalizeOutput(output: string): string {
    return output.trim();
  }

  private getTestCaseStatus(status: string): TestCaseResult["status"] {
    switch (status) {
      case "TIMEOUT":
        return "TIMEOUT";

      case "COMPILATION_ERROR":
        return "COMPILATION_ERROR";

      case "RUNTIME_ERROR":
        return "RUNTIME_ERROR";

      default:
        return "FAILED";
    }
  }
}

export { EvaluateQuestionService };
