export interface GenerateChallengeRequest {
  topic: string;
  difficulty: "facil" | "intermedio" | "dificil";
  language: "javascript" | "java" | "python";
}

export interface GeneratedChallenge {
  title: string;
  description: string;
  difficulty: string;
  score: number;
  allowedLanguages: string[];
}
