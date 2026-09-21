import { SupportedLanguage } from "../../domain/questions/question";
import { EvaluationQuestionResult } from "./evaluationQuestion.model";

export interface EvaluationModel {
  id: string;
  assessmentId: string;
  language: SupportedLanguage;
  totalScore: number;
  totalQuestions: number;
  completedQuestions: number;
  status: "COMPLETED" | "FAILED";
  results: EvaluationQuestionResult[];
  createdAt: string;
}
