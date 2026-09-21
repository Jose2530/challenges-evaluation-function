import { AssessmentModel } from "../../../domain/assessments/assessment.model";

export interface AssessmentResponseDto {
  status: number;
  data?: AssessmentModel;
  message?: string;
}
