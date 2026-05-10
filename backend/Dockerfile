# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and config files
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy compiled JavaScript from build stage
COPY --from=build /app/dist ./dist

# Expose the port
EXPOSE 8082

# Start the application
CMD ["node", "dist/app.js"]
