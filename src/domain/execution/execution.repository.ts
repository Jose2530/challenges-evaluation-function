import { ExecutionModel } from "./execution.model";

export interface ExecutionRepository {
  create(execution: ExecutionModel): Promise<ExecutionModel>;
  findById(id: string): Promise<ExecutionModel | null>;
}
