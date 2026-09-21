import { EvaluationModel } from "../../../domain/evaluation/evaluation.model";
import { EvaluationRepository } from "../../../domain/evaluation/evaluation.repository";

interface GetUserEvaluationsRequest {
  body: {
    userId: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface GetUserEvaluationsResponse {
  status: number;
  data?: EvaluationModel[];
  message?: string;
}

export class GetUserEvaluationsService {
  constructor(private readonly evaluationRepository: EvaluationRepository) {}

  public async query(
    request: GetUserEvaluationsRequest
  ): Promise<GetUserEvaluationsResponse> {
    const evaluations = await this.evaluationRepository.findByUserId(
      request.body.userId
    );

    return {
      status: 200,
      data: evaluations,
    };
  }
}
