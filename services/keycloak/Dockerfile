# Use the official Keycloak base image
FROM quay.io/keycloak/keycloak:latest

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure database
ENV KC_DB=dev-file

# Configure the admin user
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

# Import realm on startup
ENV KC_FEATURES=scripts
ENV KC_HTTP_RELATIVE_PATH=/auth

# Copy realm configuration
COPY realm-config.json /opt/keycloak/data/import/

# Set up the entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]