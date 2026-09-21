import { ExecuteCodeDto } from "../../dto/execution/executeCode.dto";
import { ExecutionResult } from "../../../domain/execution/execution-result";
import { ExecutionModel } from "../../../domain/execution/execution.model";
import { ExecutionRepository } from "../../../domain/execution/execution.repository";
import { DockerExecutionEngine } from "../../../infrastructure/execution/docker-execution.engine";
import { v4 as uuidv4 } from "uuid";

interface ExecuteCodeRequest {
  body: ExecuteCodeDto;
  headers: Record<string, string | string[] | undefined>;
  userId?: string;
}

interface ExecuteCodeResponse {
  status: number;
  data: ExecutionResult;
}

class ExecuteCodeService {
  constructor(private readonly executionRepository?: ExecutionRepository) {}

  private readonly executionEngine = new DockerExecutionEngine();

  public async query(
    request: ExecuteCodeRequest
  ): Promise<ExecuteCodeResponse> {
    const result: ExecutionResult = await this.executionEngine.execute({
      code: request.body.code,
      language: request.body.language,
      input: request.body.input,
      timeoutMs: 5000,
    });

    if (!this.executionRepository) {
      return {
        status: 200,
        data: result,
      };
    }

    const execution: ExecutionModel = {
      id: uuidv4(),
      ...request.body,
      ...result,
      userId: request.userId,
      createdAt: new Date().toISOString(),
    };

    const savedExecution = await this.executionRepository.create(execution);

    return {
      status: 200,
      data: savedExecution,
    };
  }
}

export { ExecuteCodeService };
