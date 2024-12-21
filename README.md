# AI Agent Platform
## Steps
1. Create .env file
Replace the env macro with yours, and past them in .env file
```
# AWS Configuration
AWS_REGION=us-west-1
AWS_ACCESS_KEY_ID=your_access_key_from_aws_console
AWS_SECRET_ACCESS_KEY=your_secret_key_from_aws_console
AWS_ACCOUNT_ID=your_aws_account_12_digits
S3_BUCKET_NAME=cfn-art

# EC2 Configuration
EC2_KEY_PAIR_NAME=replace-with-your-key-pair
EC2_INSTANCE_TYPE=t2.micro
EC2_AMI_ID=ami-0c55b31ad2299a701

# Keycloak Configuration
KEYCLOAK_REALM=agent-platform-realm
KEYCLOAK_CLIENT_ID=agent-platform-client
KEYCLOAK_CLIENT_SECRET=replace_with_yours
KEYCLOAK_ADMIN_USER=default_admin
KEYCLOAK_ADMIN_PASSWORD=default_pass
KEYCLOAK_WEB_CLIENT_ID=agent-platform-web-client
KEYCLOAK_WEB_CLIENT_SECRET=your-keycloak-web-client-secret

# DynamoDB Tables
DYNAMODB_USER_TABLE=UserTable
DYNAMODB_AGENT_TABLE=AgentTable
DYNAMODB_USER_LOGIN_TABLE=LoginTable

# Service Ports
DATASTORE_API_PORT=3001
CONTROL_API_PORT=3002
SEARCH_API_PORT=3003
WEB_SERVICE_PORT=3000

# Docker Compose
COMPOSE_PROJECT_NAME=agent-platform

# GitHub Details
GITHUB_USERNAME=guanmasons
GITHUB_REPO=agent-platform
```
2. Deploy
On your local, run:
```
./load_env.sh
./deploy.sh
```