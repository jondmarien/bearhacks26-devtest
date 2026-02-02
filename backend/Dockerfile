# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Copy shared directory (assumes build context is root of repo)
COPY shared /shared

# Copy backend package files
COPY backend/package.json backend/bun.lock ./

# Install dependencies
RUN bun install --production

# Copy backend source code
COPY backend .

# Expose port
EXPOSE 5000

# Start the server
CMD ["bun", "run", "index.ts"]
