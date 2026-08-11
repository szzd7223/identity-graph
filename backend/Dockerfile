# Multi-stage Dockerfile for IdentityGraph Express & MCP Backend

# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for Prisma & TypeScript)
RUN npm install

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma client and compile TypeScript to dist/
RUN npx prisma generate
RUN npm run build

# Prune devDependencies to keep final image minimal
RUN npm prune --production

# ==========================================
# Stage 2: Production runtime stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built app and dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Expose server port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start server
CMD ["node", "dist/index.js"]
