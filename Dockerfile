FROM node:20-slim

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client and build
RUN npx prisma generate
RUN npm run build

# Expose port
EXPOSE 3001

# Start command with migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
