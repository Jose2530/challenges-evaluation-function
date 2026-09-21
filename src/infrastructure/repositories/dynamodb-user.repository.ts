import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { UserModel } from "../../domain/users/user.model";
import { UserRepository } from "../../domain/users/user.repository";

export class DynamoDBUserRepository implements UserRepository {
  constructor(
    private readonly dynamo: DynamoDBDocumentClient,
    private readonly tableName: string
  ) {}

  public async create(user: UserModel): Promise<UserModel> {
    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: user,
      })
    );

    return user;
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    const result = await this.dynamo.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#email = :email",
        ExpressionAttributeNames: {
          "#email": "email",
        },
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return result.Items[0] as UserModel;
  }

  public async findById(id: string): Promise<UserModel | null> {
    const result = await this.dynamo.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          id,
        },
      })
    );

    return (result.Item as UserModel) ?? null;
  }
}
