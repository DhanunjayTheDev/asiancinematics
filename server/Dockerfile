# ---- Build stage ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage ----
FROM node:22-alpine AS runtime
RUN apk add --no-cache tini
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads && chown -R node:node /app

USER node

# Cloud Run injects PORT (defaults to 8080) — config.port already reads process.env.PORT.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||8080)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
