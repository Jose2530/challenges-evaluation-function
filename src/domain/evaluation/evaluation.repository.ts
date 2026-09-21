import { EvaluationModel } from "./evaluation.model";

export interface EvaluationRepository {
  create(evaluation: EvaluationModel): Promise<EvaluationModel>;

  findById(id: string): Promise<EvaluationModel | null>;

  findAll(): Promise<EvaluationModel[]>;

  findByAssessmentId(assessmentId: string): Promise<EvaluationModel[]>;

  findByUserId(userId: string): Promise<EvaluationModel[]>;
}
