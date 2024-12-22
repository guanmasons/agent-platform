#!/bin/bash
set -e

# Load environment variables
source .env

# Package CloudFormation template
echo "Packaging CloudFormation template..."
aws cloudformation package \
    --template-file infrastructure/cloudformation/main.yaml \
    --s3-bucket ${S3_BUCKET_NAME} \
    --output-template-file infrastructure/cloudformation/packaged-main.yaml

# Deploy CloudFormation stack
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file infrastructure/cloudformation/packaged-main.yaml \
    --stack-name agent-platform \
    --parameter-overrides \
        StackName=agent-platform \
        EC2KeyPairName=${EC2_KEY_PAIR_NAME} \
        KeycloakClientSecret=${KEYCLOAK_CLIENT_SECRET} \
        KeycloakAdminPassword=${KEYCLOAK_ADMIN_PASSWORD} \
        AwsAccessKeyId=${AWS_ACCESS_KEY_ID} \
        AwsSecretAccessKey=${AWS_SECRET_ACCESS_KEY} \
        KeycloakRealm=${KEYCLOAK_REALM:-agent-platform-realm} \
        KeycloakClientId=${KEYCLOAK_CLIENT_ID:-agent-platform-client} \
        KeycloakAdminUser=${KEYCLOAK_ADMIN_USER:-admin} \
        KeycloakWebClientId=${KEYCLOAK_WEB_CLIENT_ID:-agent-platform-web-client} \
        DatastoreApiPort=${DATASTORE_API_PORT:-3001} \
        ControlApiPort=${CONTROL_API_PORT:-3002} \
        SearchApiPort=${SEARCH_API_PORT:-3003} \
        WebServicePort=${WEB_SERVICE_PORT:-3000} \
        GitHubUsername=${GITHUB_USERNAME:-guanmasons} \
        GitHubRepo=${GITHUB_REPO:-agent-platform} \
    --capabilities CAPABILITY_IAM

# Get stack outputs
echo "Getting stack outputs..."
INSTANCE_IP=$(aws cloudformation describe-stacks \
    --stack-name agent-platform \
    --query 'Stacks[0].Outputs[?OutputKey==`EC2InstancePublicIP`].OutputValue' \
    --output text)

INSTANCE_DNS=$(aws cloudformation describe-stacks \
    --stack-name agent-platform \
    --query 'Stacks[0].Outputs[?OutputKey==`EC2InstancePublicDNS`].OutputValue' \
    --output text)

echo "Deployment complete!"
echo "Instance IP: ${INSTANCE_IP}"
echo "Instance DNS: ${INSTANCE_DNS}"