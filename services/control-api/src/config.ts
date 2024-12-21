export const SERVICE_PORT = Number(process.env.CONTROL_API_PORT) || 3002;
export const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || "ai-agent-realm";
export const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || "ai-agent-client";
export const KEYCLOAK_CLIENT_SECRET = process.env.KEYCLOAK_CLIENT_SECRET || "your-keycloak-client-secret";
export const KEYCLOAK_ADMIN_USER = process.env.KEYCLOAK_ADMIN_USER || "admin";
export const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || "admin-password";
export const KEYCLOAK_SERVER_URL = process.env.KEYCLOAK_SERVER_URL || "http://keycloak:8080";
export const DATASTORE_API_URL = process.env.DATASTORE_API_URL || "http://datastore-api:3001";