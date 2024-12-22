import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  AttributeValue
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Agent } from "../types/agent";

export class AgentModel {
  private readonly tableName: string;
  private readonly dynamoDb: DynamoDBClient;

  constructor(dynamoDb: DynamoDBClient, tableName: string) {
    this.tableName = tableName;
    this.dynamoDb = dynamoDb;
  }

  async getAgent(id: string): Promise<Agent | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id }),
    };

    const { Item } = await this.dynamoDb.send(new GetItemCommand(params));
    return Item ? (unmarshall(Item) as Agent) : null;
  }

  async createAgent(agent: Agent): Promise<Agent> {
    const params = {
      TableName: this.tableName,
      Item: marshall(agent),
    };

    await this.dynamoDb.send(new PutItemCommand(params));
    return agent;
  }

  async updateAgent(agent: Agent): Promise<Agent> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id: agent.id }),
      UpdateExpression:
        "set #name = :name, userId = :userId, description = :description, #status = :status, scope = :scope, oosAction = :oosAction, updatedAt = :updatedAt, url = :url, mstpAddr = :mstpAddr",
      ExpressionAttributeNames: {
        "#name": "name",
        "#status": "status"
      },
      ExpressionAttributeValues: marshall({
        ":name": agent.name,
        ":userId": agent.userId,
        ":description": agent.description,
        ":status": agent.status,
        ":scope": agent.scope,
        ":oosAction": agent.oosAction,
        ":updatedAt": agent.updatedAt,
        ":url": agent.url,
        ":mstpAddr": agent.mstpAddr,
      }),
      ReturnValues: "ALL_NEW" as const,
    };

    const { Attributes } = await this.dynamoDb.send(new UpdateItemCommand(params));
    
    if (!Attributes) {
      throw new Error(`Agent with id ${agent.id} not found`);
    }
    
    return unmarshall(Attributes) as Agent;
  }

  async deleteAgent(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ id }),
    };

    await this.dynamoDb.send(new DeleteItemCommand(params));
  }

  async getAgentsByUserId(userId: string): Promise<Agent[]> {
    const params = {
      TableName: this.tableName,
      IndexName: "UserAgentIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: marshall({
        ":userId": userId,
      }),
    };

    const { Items } = await this.dynamoDb.send(new QueryCommand(params));
    return Items ? Items.map(item => unmarshall(item) as Agent) : [];
  }
}