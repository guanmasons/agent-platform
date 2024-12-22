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
    DynamoDBUserTableName=${DYNAMODB_USER_TABLE} \
    DynamoDBAgentTableName=${DYNAMODB_AGENT_TABLE} \
    DynamoDBUserLoginTableName=${DYNAMODB_USER_LOGIN_TABLE} \
    --capabilities CAPABILITY_IAM

# Get stack outputs
echo "Getting stack outputs..."
INSTANCE_IP=$(aws cloudformation describe-stacks \
    --stack-name agent-platform \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicIP`].OutputValue' \
    --output text)

INSTANCE_DNS=$(aws cloudformation describe-stacks \
    --stack-name agent-platform \
    --query 'Stacks[0].Outputs[?OutputKey==`PublicDNS`].OutputValue' \
    --output text)

echo "Deployment complete!"
echo "Instance IP: ${INSTANCE_IP}"
echo "Instance DNS: ${INSTANCE_DNS}"