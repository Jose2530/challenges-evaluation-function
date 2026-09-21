import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import CONFIG from "../../config";
import { AssessmentModel } from "../../domain/assessments/assessment.model";
import { AssessmentRepository } from "../../domain/assessments/assessment.repository";
import { dynamoDBDocumentClient } from "../config/dynamoDB";

export class DynamoDBAssessmentRepository implements AssessmentRepository {
  public async create(assessment: AssessmentModel): Promise<AssessmentModel> {
    await dynamoDBDocumentClient.send(
      new PutCommand({
        TableName: CONFIG.DYNAMODB.ASSESSMENTS_TABLE,
        Item: assessment,
      })
    );

    return assessment;
  }
  public async findAll(): Promise<AssessmentModel[]> {
    const result = await dynamoDBDocumentClient.send(
      new ScanCommand({
        TableName: CONFIG.DYNAMODB.ASSESSMENTS_TABLE,
      })
    );

    return (result.Items ?? []) as AssessmentModel[];
  }

  public async findById(id: string): Promise<AssessmentModel | null> {
    const result = await dynamoDBDocumentClient.send(
      new GetCommand({
        TableName: CONFIG.DYNAMODB.ASSESSMENTS_TABLE,
        Key: {
          id,
        },
      })
    );

    return (result.Item as AssessmentModel) ?? null;
  }
}
