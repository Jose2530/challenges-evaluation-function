import {
  ChallengeType,
  SupportedLanguage,
} from "../../../domain/questions/question";

export interface CreateQuestionTestCaseDto {
  input: string;
  expectedOutput: string;
  hidden: boolean;
  weight: number;
}

export interface CreateQuestionDto {
  title: string;
  description: string;
  challengeType: ChallengeType;
  allowedLanguages: SupportedLanguage[];
  testCases: CreateQuestionTestCaseDto[];
  score: number;
}
