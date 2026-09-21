export interface EvaluateChallengeDto {
  question: {
    title: string;
    description: string;
    difficulty: string;
  };
  code: string;
  language: string;
}
