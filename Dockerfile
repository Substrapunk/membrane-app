FROM node:18-alpine AS builder
RUN npm install -g pnpm
ENV NODE_ENV production

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm i

# Copy app files
COPY . .

# Build the app
RUN pnpm run build

# Expose port
EXPOSE 3000
