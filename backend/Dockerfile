
# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Copy package files
COPY package.json ./
# If you have a lockfile, uncomment the next line
# COPY bun.lockb ./

# Install dependencies
RUN bun install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["bun", "run", "index.ts"]
