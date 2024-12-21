export const CONTROL_API_BASE_URL = process.env.REACT_APP_CONTROL_API_URL || "http://your-ec2-public-ip:3002"; // Update with your EC2 instance's public IP after deployment
export const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL || 'http://your-ec2-public-ip:8080'; // Update with your EC2 instance's public IP after deployment
export const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || 'ai-agent-realm';
export const APP_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'ai-agent-web-client';