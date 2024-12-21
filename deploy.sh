#!/bin/bash
set -e

# Load environment variables
source .env

echo "Starting deployment process..."

# Deploy/Update the stack
aws cloudformation deploy \
    --template-file infrastructure/cloudformation/main.yaml \
    --stack-name agent-platform \
    --parameter-overrides \
        EC2InstanceType=$EC2_INSTANCE_TYPE \
        EC2KeyPairName=$EC2_KEY_PAIR_NAME \
        KeycloakRealm=$KEYCLOAK_REALM \
        KeycloakClientId=$KEYCLOAK_CLIENT_ID \
        KeycloakClientSecret=$KEYCLOAK_CLIENT_SECRET \
        KeycloakAdminUser=$KEYCLOAK_ADMIN_USER \
        KeycloakAdminPassword=$KEYCLOAK_ADMIN_PASSWORD \
        KeycloakWebClientId=$KEYCLOAK_WEB_CLIENT_ID \
        DatastoreApiPort=$DATASTORE_API_PORT \
        ControlApiPort=$CONTROL_API_PORT \
        SearchApiPort=$SEARCH_API_PORT \
        WebServicePort=$WEB_SERVICE_PORT \
        GitHubUsername=$GITHUB_USERNAME \
        GitHubRepo=$GITHUB_REPO \
        AwsAccessKeyId=$AWS_ACCESS_KEY_ID \
        AwsSecretAccessKey=$AWS_SECRET_ACCESS_KEY \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION

# Get stack outputs
echo "Retrieving stack outputs..."
aws cloudformation describe-stacks \
    --stack-name agent-platform \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table \
    --region $AWS_REGION

echo "Deployment completed successfully!"