import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Agent } from "../types/agent";

export class AgentModel {
  private dynamodbClient: DynamoDBClient;
  private tableName: string;

  constructor(dynamodbClient: DynamoDBClient, tableName: string) {
    this.dynamodbClient = dynamodbClient;
    this.tableName = tableName;
  }

  async getAgent(agentId: string): Promise<Agent | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ agentId: agentId }),
    };

    const { Item } = await this.dynamodbClient.send(new GetItemCommand(params));
    return Item ? (unmarshall(Item) as Agent) : null;
  }

  async createAgent(agent: Agent): Promise<Agent> {
    const agentItem = {
        agentId: agent.agentId,
        agentName: agent.agentName,
        userId: agent.userId,
        description: agent.description,
        scope: agent.scope,
        oosAction: agent.oosAction,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
        url: agent.url,
        mstpAddr: agent.mstpAddr,
      };

    const params = {
      TableName: this.tableName,
      Item: marshall(agentItem),
    };

    await this.dynamodbClient.send(new PutItemCommand(params));
    return agent;
  }

  async updateAgent(agent: Agent): Promise<Agent> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ agentId: agent.agentId }),
      UpdateExpression:
        "set agentName = :agentName, userId = :userId, description = :description, scope = :scope, oosAction = :oosAction, updatedAt = :updatedAt, url = :url, mstpAddr = :mstpAddr",
      ExpressionAttributeValues: marshall({
        ":agentName": agent.agentName,
        ":userId": agent.userId,
        ":description": agent.description,
        ":scope": agent.scope,
        ":oosAction": agent.oosAction,
        ":updatedAt": agent.updatedAt,
        ":url": agent.url,
        ":mstpAddr": agent.mstpAddr,
      }),
      ReturnValues: "ALL_NEW",
    };

    const { Attributes } = await this.dynamodbClient.send(
      new UpdateItemCommand(params)
    );
    return Attributes ? (unmarshall(Attributes) as Agent) : null;
  }

  async deleteAgent(agentId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ agentId: agentId }),
    };

    await this.dynamodbClient.send(new DeleteItemCommand(params));
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
  
    const { Items } = await this.dynamodbClient.send(new QueryCommand(params));
    return Items ? (Items.map((item) => unmarshall(item) as Agent)) : [];
  }
}