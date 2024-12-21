export const SERVICE_PORT = Number(process.env.DATASTORE_API_PORT) || 3001;
export const SERVICE_REGION = process.env.AWS_REGION || "us-west-1";
export const DYNAMODB_USER_TABLE = process.env.DYNAMODB_USER_TABLE || "UserTable";
export const DYNAMODB_AGENT_TABLE = process.env.DYNAMODB_AGENT_TABLE || "AgentTable";
export const DYNAMODB_USER_LOGIN_TABLE =
  process.env.DYNAMODB_USER_LOGIN_TABLE || "LoginTable";