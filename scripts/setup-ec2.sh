#!/bin/bash
yum update -y
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# Create directory for deployment and .env file
mkdir -p /opt/ai-agent-platform
touch /opt/ai-agent-platform/.env

# Set environment variables from CloudFormation parameters (passed via UserData)
# Note: This assumes you are passing these parameters to the EC2 instance via CloudFormation
# You might need a different mechanism depending on how you manage secrets
echo "KEYCLOAK_CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET}" >> /opt/ai-agent-platform/.env
echo "KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD}" >> /opt/ai-agent-platform/.env

# Clone the GitHub repository
git clone https://github.com/your-github-username/ai-agent-platform.git /opt/ai-agent-platform
chown -R ec2-user:ec2-user /opt/ai-agent-platform

# Build and start services using Docker Compose
cd /opt/ai-agent-platform
docker-compose -f infrastructure/docker/docker-compose.prod.yml up -d --build