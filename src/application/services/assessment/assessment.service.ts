import { v4 as uuidv4 } from "uuid";
import { AssessmentModel } from "../../../domain/assessments/assessment.model";
import { CreateAssessmentDto } from "../../dto/assessment/createAssessment.dto";
import { AssessmentRepository } from "../../../domain/assessments/assessment.repository";

interface CreateAssessmentRequest {
  body: CreateAssessmentDto;
  headers: Record<string, string | string[] | undefined>;
}

interface CreateAssessmentResponse {
  status: number;
  data?: AssessmentModel;
  message?: string;
}

class CreateAssessmentService {
  constructor(private readonly assessmentRepository: AssessmentRepository) {}

  public async query(
    request: CreateAssessmentRequest
  ): Promise<CreateAssessmentResponse> {
    const { name, description, durationMinutes, questionIds } = request.body;

    const assessment: AssessmentModel = {
      id: uuidv4(),
      name,
      description,
      durationMinutes,
      questionIds,
      createdAt: new Date().toISOString(),
    };

    const createdAssessment = await this.assessmentRepository.create(
      assessment
    );

    return {
      status: 201,
      data: createdAssessment,
    };
  }
}

export { CreateAssessmentService };
