import {
  GetCommand,
  PutCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { EvaluationModel } from "../../domain/evaluation/evaluation.model";
import { EvaluationRepository } from "../../domain/evaluation/evaluation.repository";

class DynamoDBEvaluationRepository implements EvaluationRepository {
  constructor(
    private readonly dynamo: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  public async create(evaluation: EvaluationModel): Promise<EvaluationModel> {
    const item = {
      QUESTION: `EVALUATION#${evaluation.id}`,

      METADATA: "METADATA",

      entityType: "EVALUATION",

      id: evaluation.id,
      assessmentId: evaluation.assessmentId,
      language: evaluation.language,
      totalScore: evaluation.totalScore,
      totalQuestions: evaluation.totalQuestions,
      completedQuestions: evaluation.completedQuestions,
      status: evaluation.status,
      results: evaluation.results,
      createdAt: evaluation.createdAt,
    };

    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return evaluation;
  }

  public async findById(id: string): Promise<EvaluationModel | null> {
    const result = await this.dynamo.send(
      new GetCommand({
        TableName: this.tableName,

        Key: {
          QUESTION: `EVALUATION#${id}`,
          METADATA: "METADATA",
        },
      })
    );

    if (!result.Item) {
      return null;
    }

    return this.mapToEvaluation(result.Item);
  }

  public async findAll(): Promise<EvaluationModel[]> {
    const result = await this.dynamo.send(
      new ScanCommand({
        TableName: this.tableName,

        FilterExpression: "entityType = :entityType",

        ExpressionAttributeValues: {
          ":entityType": "EVALUATION",
        },
      })
    );

    return (result.Items ?? []).map((item) => this.mapToEvaluation(item));
  }
  public async findByAssessmentId(
    assessmentId: string
  ): Promise<EvaluationModel[]> {
    const result = await this.dynamo.send(
      new QueryCommand({
        TableName: this.tableName,

        IndexName: "GSI1",

        KeyConditionExpression: "GSI1PK = :assessmentId",

        ExpressionAttributeValues: {
          ":assessmentId": `ASSESSMENT#${assessmentId}`,
        },
      })
    );

    return (result.Items ?? []).map((item) => this.mapToEvaluation(item));
  }

  public async findByUserId(userId: string): Promise<EvaluationModel[]> {
    const result = await this.dynamo.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
    );

    return (result.Items ?? []).map((item) => this.mapToEvaluation(item));
  }

  private mapToEvaluation(item: Record<string, any>): EvaluationModel {
    return {
      id: item.id,
      assessmentId: item.assessmentId,
      language: item.language,
      totalScore: item.totalScore,
      totalQuestions: item.totalQuestions,
      completedQuestions: item.completedQuestions,
      status: item.status,
      results: item.results,
      createdAt: item.createdAt,
    };
  }
}

export { DynamoDBEvaluationRepository };
