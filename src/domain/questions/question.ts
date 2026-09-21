import { TestCase } from "../../domain/testCase.model";

export type SupportedLanguage = "javascript" | "python" | "java" | "typescript";

export type ChallengeType = "java" | "cloud" | "fullstack";

export interface Question {
  id: string;
  title: string;
  description: string;
  challengeType: ChallengeType;
  allowedLanguages: SupportedLanguage[];
  testCases: TestCase[];
  score: number;
  createdAt: string;
}
