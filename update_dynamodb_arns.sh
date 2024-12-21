#!/bin/bash

# Load environment variables
./load_env.sh

get_output_value() {
  local stack_name="$1"
  local output_key="$2"
  local region="$3"

  aws cloudformation describe-stacks \
    --stack-name "$stack_name" \
    --query "Stacks[0].Outputs[?OutputKey=='$output_key'].OutputValue" \
    --output text \
    --region "$region"
}

# Get DynamoDB Table ARNs
USER_DYNAMODB_TABLE_ARN=$(get_output_value "agent-platform-dynamodb-stack" "DynamoDBTableArn" "$AWS_REGION")
AGENT_DYNAMODB_TABLE_ARN=$(get_output_value "agent-platform-dynamodb-stack" "AgentDynamoDBTableArn" "$AWS_REGION")
LOGIN_DYNAMODB_TABLE_ARN=$(get_output_value "agent-platform-dynamodb-stack" "LoginDynamoDBTableArn" "$AWS_REGION")

# Update .env file with the ARNs, only if they are not empty
if [ ! -z "$USER_DYNAMODB_TABLE_ARN" ]; then
  sed -i '' "s|DYNAMODB_TABLE_ARN=.*|DYNAMODB_TABLE_ARN=$USER_DYNAMODB_TABLE_ARN|" .env
  echo "User DynamoDB Table ARN: $USER_DYNAMODB_TABLE_ARN"
else
  echo "Warning: User DynamoDB Table ARN not found in stack outputs."
fi

if [ ! -z "$AGENT_DYNAMODB_TABLE_ARN" ]; then
  sed -i '' "s|DYNAMODB_AGENT_TABLE_ARN=.*|DYNAMODB_AGENT_TABLE_ARN=$AGENT_DYNAMODB_TABLE_ARN|" .env
  echo "Agent DynamoDB Table ARN: $AGENT_DYNAMODB_TABLE_ARN"
else
  echo "Warning: Agent DynamoDB Table ARN not found in stack outputs."
fi

if [ ! -z "$LOGIN_DYNAMODB_TABLE_ARN" ]; then
  sed -i '' "s|DYNAMODB_LOGIN_TABLE_ARN=.*|DYNAMODB_LOGIN_TABLE_ARN=$LOGIN_DYNAMODB_TABLE_ARN|" .env
  echo "Login DynamoDB Table ARN: $LOGIN_DYNAMODB_TABLE_ARN"
else
  echo "Warning: Login DynamoDB Table ARN not found in stack outputs."
fi