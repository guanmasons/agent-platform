#!/bin/bash
set -e

# Load environment variables
source .env

echo "Starting cleanup process..."

echo "Delete the CloudFormation stack"
aws cloudformation delete-stack \
    --stack-name agent-platform \
    --region $AWS_REGION

echo "Waiting for stack deletion to complete..."
aws cloudformation wait stack-delete-complete \
    --stack-name agent-platform \
    --region $AWS_REGION

# Empty and delete the S3 bucket
echo "Cleaning up S3 bucket..."
aws s3 rm s3://$S3_BUCKET_NAME --recursive || true
aws s3api delete-bucket --bucket $S3_BUCKET_NAME --region $AWS_REGION || true

echo "Cleanup completed successfully!"