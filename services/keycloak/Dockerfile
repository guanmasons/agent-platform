# Use the official Keycloak base image
FROM quay.io/keycloak/keycloak:latest as builder

# Set the working directory inside the container
WORKDIR /opt/keycloak

# Copy the realm configuration file into the container
COPY realm-config.json /opt/keycloak/data/import/realm-config.json

# Perform any other necessary configuration or customization here

# Import the realm configuration on container startup
CMD ["--import-realm"]