import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SERVICE_REGION, DYNAMODB_USER_TABLE, DYNAMODB_AGENT_TABLE, DYNAMODB_USER_LOGIN_TABLE } from "../config";

const dynamodbClient = new DynamoDBClient({ region: SERVICE_REGION });

export { dynamodbClient, DYNAMODB_USER_TABLE, DYNAMODB_AGENT_TABLE, DYNAMODB_USER_LOGIN_TABLE };