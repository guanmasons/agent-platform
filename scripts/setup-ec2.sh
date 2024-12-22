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
mkdir -p /opt/${STACK_NAME}
touch /opt/${STACK_NAME}/.env

# Set environment variables from CloudFormation parameters
echo "KEYCLOAK_CLIENT_SECRET=${KEYCLOAK_CLIENT_SECRET}" >> /opt/${STACK_NAME}/.env
echo "KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD}" >> /opt/${STACK_NAME}/.env

# Clone the GitHub repository
git clone https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git /opt/${STACK_NAME}
chown -R ec2-user:ec2-user /opt/${STACK_NAME}

# Build and start services using Docker Compose
cd /opt/${STACK_NAME}
docker-compose -f infrastructure/docker/docker-compose.prod.yml up -d --build