import { v4 as uuidv4 } from "uuid";

import { CreateQuestionDto } from "../../dto/question/createQuestion.dto";
import { Question } from "../../../domain/questions/question";
import { QuestionRepository } from "../../../domain/questions/question.repository";

interface CreateQuestionRequest {
  body: CreateQuestionDto;
  headers: Record<string, string | string[] | undefined>;
}

interface CreateQuestionResponse {
  status: number;
  data?: Question;
  message?: string;
}

class CreateQuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  public async query(
    request: CreateQuestionRequest
  ): Promise<CreateQuestionResponse> {
    const {
      title,
      description,
      challengeType,
      allowedLanguages,
      testCases,
      score,
    } = request.body;

    const question: Question = {
      id: uuidv4(),
      title,
      description,
      challengeType,
      allowedLanguages,

      testCases: testCases.map((testCase) => ({
        id: uuidv4(),
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        hidden: testCase.hidden,
        weight: testCase.weight,
      })),

      score,
      createdAt: new Date().toISOString(),
    };

    const createdQuestion = await this.questionRepository.create(question);

    return {
      status: 201,
      data: createdQuestion,
    };
  }
}

export { CreateQuestionService };
