import { AssessmentModel } from "./assessment.model";

export interface AssessmentRepository {
  create(assessment: AssessmentModel): Promise<AssessmentModel>;

  findAll(): Promise<AssessmentModel[]>;

  findById(id: string): Promise<AssessmentModel | null>;
}
