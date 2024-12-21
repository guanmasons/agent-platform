import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    ScanCommand,
  } from "@aws-sdk/client-dynamodb";
  import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
  import { User } from "../types/user";
  
  export class UserModel {
    private dynamodbClient: DynamoDBClient;
    private tableName: string;
    private userLoginTableName: string;
  
    constructor(dynamodbClient: DynamoDBClient, tableName: string, userLoginTableName: string) {
      this.dynamodbClient = dynamodbClient;
      this.tableName = tableName;
      this.userLoginTableName = userLoginTableName;
    }
  
    async getUser(userId: string): Promise<User | null> {
      const params = {
        TableName: this.tableName,
        Key: marshall({ userId: userId }),
      };
  
      const { Item } = await this.dynamodbClient.send(new GetItemCommand(params));
      return Item ? (unmarshall(Item) as User) : null;
    }
  
    async createUser(user: User): Promise<User> {
      const userItem = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
  
      const params = {
        TableName: this.tableName,
        Item: marshall(userItem),
      };
  
      await this.dynamodbClient.send(new PutItemCommand(params));
      return user;
    }
  
    async updateUser(user: User): Promise<User> {
      const params = {
        TableName: this.tableName,
        Key: marshall({ userId: user.userId }),
        UpdateExpression:
          "set username = :username, email = :email, firstName = :firstName, lastName = :lastName, companyName = :companyName, updatedAt = :updatedAt",
        ExpressionAttributeValues: marshall({
          ":username": user.username,
          ":email": user.email,
          ":firstName": user.firstName,
          ":lastName": user.lastName,
          ":companyName": user.companyName,
          ":updatedAt": user.updatedAt,
        }),
        ReturnValues: "ALL_NEW",
      };
  
      const { Attributes } = await this.dynamodbClient.send(
        new UpdateItemCommand(params)
      );
      return Attributes ? (unmarshall(Attributes) as User) : null;
    }
  
    async deleteUser(userId: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: marshall({ userId: userId }),
      };
  
      await this.dynamodbClient.send(new DeleteItemCommand(params));
    }
  
    async getUserByEmail(email: string): Promise<User | null> {
      const params = {
        TableName: this.tableName,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: marshall({
          ":email": email,
        }),
      };
  
      const { Items } = await this.dynamodbClient.send(new ScanCommand(params)); // Note: Scan is used with GSI
  
      if (Items && Items.length > 0) {
        return unmarshall(Items[0]) as User;
      } else {
        return null;
      }
    }

    async saveUserLogin(userId: string, passwordHash: string): Promise<void> {
        const loginItem = {
            userId: userId,
            passwordHash,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        const params = {
            TableName: this.userLoginTableName,
            Item: marshall(loginItem),
        };

        await this.dynamodbClient.send(new PutItemCommand(params));
    }
  }