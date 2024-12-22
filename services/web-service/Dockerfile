# Build stage
FROM node:18 as build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install --legacy-peer-deps && \
    npm install ajv@latest

# Copy source code
COPY . .

# Set environment variables for build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers
RUN echo "add_header X-Frame-Options DENY;" >> /etc/nginx/conf.d/default.conf && \
    echo "add_header X-Content-Type-Options nosniff;" >> /etc/nginx/conf.d/default.conf && \
    echo "add_header X-XSS-Protection \"1; mode=block\";" >> /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]