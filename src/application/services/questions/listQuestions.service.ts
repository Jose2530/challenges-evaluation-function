import { Question } from "../../../domain/questions/question";
import { QuestionRepository } from "../../../domain/questions/question.repository";

interface ListQuestionsRequest {
  body?: {
    challengeType?: string;
  };
  query?: {
    challengeType?: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface ListQuestionsResponse {
  status: number;
  data: Question[];
}

class ListQuestionsService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  public async query(
    request: ListQuestionsRequest
  ): Promise<ListQuestionsResponse> {
    const questions = await this.questionRepository.findAll();
    const challengeType =
      request.query?.challengeType ?? request.body?.challengeType;

    const filteredQuestions = challengeType
      ? questions.filter((question) => question.challengeType === challengeType)
      : questions;

    return {
      status: 200,
      data: filteredQuestions,
    };
  }
}

export { ListQuestionsService };
