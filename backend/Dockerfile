# Backend Dockerfile
FROM oven/bun:1.0

WORKDIR /app

# Copy migration/package files
COPY package.json .
COPY bun.lock .
COPY prisma ./prisma

# Install dependencies (including dev deps for Prisma)
RUN bun install

# Copy source code
COPY . .

# Generate Prisma Client
RUN bun prisma generate

# Expose port
EXPOSE 3001

# Start server
CMD ["bun", "run", "src/index.ts"]
