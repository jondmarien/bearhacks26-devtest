# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Copy shared directory (assumes build context is root of repo)
COPY shared /shared

# --- Build Frontend ---
# Copy frontend source
COPY frontend /frontend
WORKDIR /frontend

# Install frontend dependencies and build
RUN bun install
RUN bun run build

# --- Setup Backend ---
WORKDIR /app

# Copy backend package files
COPY backend/package.json backend/bun.lock ./

# Install backend dependencies
RUN bun install --production

# Copy backend source code
COPY backend .

# Expose port
EXPOSE 5000

# Start the server
CMD ["bun", "run", "index.ts"]
