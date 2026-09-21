import { AssessmentModel } from "../../../domain/assessments/assessment.model";
import { AssessmentRepository } from "../../../domain/assessments/assessment.repository";

interface GetAssessmentRequest {
  body: {
    id: string;
  };
  headers: Record<string, string | string[] | undefined>;
}

interface GetAssessmentResponse {
  status: number;
  data?: AssessmentModel;
  message?: string;
}

class GetAssessmentService {
  constructor(private readonly assessmentRepository: AssessmentRepository) {}

  public async query(
    request: GetAssessmentRequest
  ): Promise<GetAssessmentResponse> {
    const assessment = await this.assessmentRepository.findById(
      request.body.id
    );

    if (!assessment) {
      return {
        status: 404,
        message: "Assessment not found",
      };
    }

    return {
      status: 200,
      data: assessment,
    };
  }
}

export { GetAssessmentService };
