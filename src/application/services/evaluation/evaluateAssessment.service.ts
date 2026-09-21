import { v4 as uuidv4 } from "uuid";
import { SupportedLanguage } from "../../../domain/questions/question";
import { AssessmentRepository } from "../../../domain/assessments/assessment.repository";
import { QuestionRepository } from "../../../domain/questions/question.repository";

import { EvaluateQuestionService } from "./evaluateQuestion.service";

import { EvaluationRepository } from "../../../domain/evaluation/evaluation.repository";

import { EvaluationModel } from "../../../domain/evaluation/evaluation.model";

import { EvaluationQuestionResult } from "../../../domain/evaluation/evaluationQuestion.model";

interface EvaluateAssessmentRequest {
  assessmentId: string;
  codeByQuestion: Record<string, string>;
  language: SupportedLanguage;
}

interface EvaluateAssessmentResponse {
  status: number;
  data?: EvaluationModel;
  message?: string;
}

class EvaluateAssessmentService {
  constructor(
    private readonly assessmentRepository: AssessmentRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly evaluateQuestionService: EvaluateQuestionService,
    private readonly evaluationRepository: EvaluationRepository
  ) {}

  public async query(
    request: EvaluateAssessmentRequest
  ): Promise<EvaluateAssessmentResponse> {
    const assessment = await this.assessmentRepository.findById(
      request.assessmentId
    );

    if (!assessment) {
      return {
        status: 404,
        message: "Assessment not found",
      };
    }

    const questions: {
      question: NonNullable<
        Awaited<ReturnType<QuestionRepository["findById"]>>
      >;
      code: string;
    }[] = [];

    for (const questionId of assessment.questionIds) {
      const question = await this.questionRepository.findById(questionId);

      if (!question) {
        return {
          status: 404,
          message: `Question ${questionId} not found`,
        };
      }

      if (!question.allowedLanguages.includes(request.language)) {
        return {
          status: 400,
          message: `Language ${request.language} is not allowed for question ${questionId}`,
        };
      }

      const code = request.codeByQuestion[questionId];

      if (typeof code !== "string" || !code.trim()) {
        return {
          status: 400,
          message: `Code not provided for question ${questionId}`,
        };
      }
      questions.push({
        question,
        code,
      });
    }

    const results: EvaluationQuestionResult[] = [];

    for (const { question, code } of questions) {
      const evaluation = await this.evaluateQuestionService.query({
        question,
        code,
        language: request.language,
      });

      results.push({
        questionId: question.id,

        score: evaluation.data.score,

        totalTestCases: evaluation.data.totalTestCases,

        passedTestCases: evaluation.data.passedTestCases,

        failedTestCases: evaluation.data.failedTestCases,

        results: evaluation.data.results,
      });
    }

    const totalScore = results.reduce(
      (total, result) => total + result.score,
      0
    );

    const evaluation: EvaluationModel = {
      id: uuidv4(),

      assessmentId: assessment.id,

      language: request.language,

      totalScore,

      totalQuestions: assessment.questionIds.length,

      completedQuestions: results.length,

      status: "COMPLETED",

      results,

      createdAt: new Date().toISOString(),
    };

    const savedEvaluation = await this.evaluationRepository.create(evaluation);

    return {
      status: 200,
      data: savedEvaluation,
    };
  }
}

export { EvaluateAssessmentService };
