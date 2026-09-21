import { Question } from "../../../domain/questions/question";
import { QuestionRepository } from "../../../domain/questions/question.repository";

interface GetQuestionRequest {
  body: {
    id: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface GetQuestionResponse {
  status: number;
  data?: Question;
  message?: string;
}

class GetQuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  public async query(
    request: GetQuestionRequest
  ): Promise<GetQuestionResponse> {
    const question = await this.questionRepository.findById(request.body.id);

    if (!question) {
      return {
        status: 404,
        message: "Question not found",
      };
    }

    return {
      status: 200,
      data: question,
    };
  }
}

export { GetQuestionService };
