import { EvaluationRepository } from "../../../domain/evaluation/evaluation.repository";

interface GetEvaluationRequest {
  body: {
    id: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface GetEvaluationResponse {
  status: number;
  data?: unknown;
  message?: string;
}

class GetEvaluationService {
  constructor(private readonly evaluationRepository: EvaluationRepository) {}

  public async query(
    request: GetEvaluationRequest
  ): Promise<GetEvaluationResponse> {
    const evaluation = await this.evaluationRepository.findById(
      request.body.id
    );

    if (!evaluation) {
      return {
        status: 404,
        message: "Evaluation not found",
      };
    }

    return {
      status: 200,
      data: evaluation,
    };
  }
}

export { GetEvaluationService };
