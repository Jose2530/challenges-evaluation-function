import { TestCase } from "./test-case";

export interface Question {
  id: string;
  title: string;
  description: string;
  allowedLanguages: string[];
  score: number;
  testCases: TestCase[];
}
