import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Question } from "../../domain/questions/question";
import { QuestionRepository } from "../../domain/questions/question.repository";

export class DynamoDBQuestionRepository implements QuestionRepository {
  constructor(
    private readonly dynamo: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  public async create(question: Question): Promise<Question> {
    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          QUESTION: question.id,
          METADATA: "METADATA",

          entityType: "QUESTION",

          id: question.id,
          title: question.title,
          description: question.description,
          challengeType: question.challengeType,
          allowedLanguages: question.allowedLanguages,
          score: question.score,
          createdAt: question.createdAt,
        },
      })
    );

    for (const testCase of question.testCases) {
      for (const testCase of question.testCases) {
        await this.dynamo.send(
          new PutCommand({
            TableName: this.tableName,
            Item: {
              QUESTION: question.id,
              METADATA: `TESTCASE#${testCase.id}`,

              entityType: "TESTCASE",

              id: testCase.id,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              hidden: testCase.hidden,
              weight: testCase.weight,
            },
          })
        );
      }
    }
    return question;
  }

  public async findById(id: string): Promise<Question | null> {
    const result = await this.dynamo.send(
      new QueryCommand({
        TableName: this.tableName,

        KeyConditionExpression: "#question = :question",

        ExpressionAttributeNames: {
          "#question": "QUESTION",
        },

        ExpressionAttributeValues: {
          ":question": id,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const metadata = result.Items.find((item) => item.METADATA === "METADATA");

    if (!metadata) {
      return null;
    }

    const testCases = result.Items.filter(
      (item) =>
        typeof item.METADATA === "string" &&
        item.METADATA.startsWith("TESTCASE#")
    ).map((item) => ({
      id: item.id,
      input: item.input,
      expectedOutput: item.expectedOutput,
      hidden: item.hidden,
      weight: item.weight,
    }));

    return {
      id: metadata.id,
      title: metadata.title,
      description: metadata.description,
      challengeType: metadata.challengeType ?? "java",
      allowedLanguages: metadata.allowedLanguages,
      score: metadata.score,
      testCases,
      createdAt: metadata.createdAt,
    };
  }

  public async findAll(): Promise<Question[]> {
    const result = await this.dynamo.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );

    const items = result.Items ?? [];

    const questionItems = items.filter(
      (item) => item.entityType === "QUESTION" && item.METADATA === "METADATA"
    );

    return questionItems.map((questionItem) => {
      const testCases = items
        .filter(
          (item) =>
            item.entityType === "TESTCASE" &&
            item.QUESTION === questionItem.QUESTION
        )
        .map((item) => ({
          id: item.id,
          input: item.input,
          expectedOutput: item.expectedOutput,
          hidden: item.hidden,
          weight: item.weight,
        }));

      return {
        id: questionItem.id,
        title: questionItem.title,
        description: questionItem.description,
        challengeType: questionItem.challengeType ?? "java",
        allowedLanguages: questionItem.allowedLanguages,
        score: questionItem.score,
        testCases,
        createdAt: questionItem.createdAt,
      };
    });
  }
  public async update(question: Question): Promise<void> {
    await this.create(question);
  }

  public async delete(id: string): Promise<void> {
    const result = await this.dynamo.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `QUESTION${id}`,
        },
      })
    );

    if (!result.Items?.length) {
      return;
    }

    for (const item of result.Items) {
      await this.dynamo.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: {
            PK: item.PK,
            SK: item.SK,
          },
        })
      );
    }
  }
}
