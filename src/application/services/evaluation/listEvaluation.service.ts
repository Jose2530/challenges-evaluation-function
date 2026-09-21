import { EvaluationModel } from "../../../domain/evaluation/evaluation.model";
import { EvaluationRepository } from "../../../domain/evaluation/evaluation.repository";

interface ListEvaluationRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ListEvaluationResponse {
  status: number;
  data?: EvaluationModel[];
  message?: string;
}

class ListEvaluationService {
  constructor(private readonly evaluationRepository: EvaluationRepository) {}

  public async query(
    _request: ListEvaluationRequest
  ): Promise<ListEvaluationResponse> {
    const evaluations = await this.evaluationRepository.findAll();

    return {
      status: 200,
      data: evaluations,
    };
  }
}

export { ListEvaluationService };
