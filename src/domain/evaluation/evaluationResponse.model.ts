export interface EvaluateChallengeItem {
  exercise: {
    question: {
      title: string;
      description: string;
      difficulty: string;
    };
  };
  candidate: {
    language: string;
    code: string;
  };
}

export interface EvaluateChallengeRequest {
  body: {
    exercises: EvaluateChallengeItem[];
  };
  headers: Record<string, string | string[] | undefined>;
}

export interface EvaluationResult {
  exerciseIndex: number;
  score: number;
  evaluation: {
    correctness: number;
    codeQuality: number;
    edgeCases: number;
  };
  feedback: string;
  recommendations: string[];
}

export interface EvaluateChallengeResponseData {
  evaluations: EvaluationResult[];
  summary: {
    totalExercises: number;
    averageScore: number;
  };
}
