import { AssessmentModel } from "../../../domain/assessments/assessment.model";
import { AssessmentRepository } from "../../../domain/assessments/assessment.repository";

interface ListAssessmentsRequest {
  headers: Record<string, string | string[] | undefined>;
}

interface ListAssessmentsResponse {
  status: number;
  data: AssessmentModel[];
}

class ListAssessmentsService {
  constructor(private readonly assessmentRepository: AssessmentRepository) {}

  public async query(
    _request: ListAssessmentsRequest
  ): Promise<ListAssessmentsResponse> {
    const assessments = await this.assessmentRepository.findAll();

    return {
      status: 200,
      data: assessments,
    };
  }
}

export { ListAssessmentsService };
