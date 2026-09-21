import {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { ExecutionModel } from "../../domain/execution/execution.model";
import { ExecutionRepository } from "../../domain/execution/execution.repository";

export class DynamoDBExecutionRepository implements ExecutionRepository {
  constructor(
    private readonly dynamo: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  public async create(execution: ExecutionModel): Promise<ExecutionModel> {
    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          QUESTION: `EXECUTION#${execution.id}`,
          METADATA: "METADATA",
          entityType: "EXECUTION",
          ...execution,
        },
      })
    );

    return execution;
  }

  public async findById(id: string): Promise<ExecutionModel | null> {
    const result = await this.dynamo.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          QUESTION: `EXECUTION#${id}`,
          METADATA: "METADATA",
        },
      })
    );

    return (result.Item as ExecutionModel) ?? null;
  }
}
