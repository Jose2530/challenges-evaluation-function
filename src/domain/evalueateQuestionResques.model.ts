import { Question, SupportedLanguage } from "./questions/question";

export interface EvaluateQuestionRequest {
  question: Question;
  code: string;
  language: SupportedLanguage;
}
