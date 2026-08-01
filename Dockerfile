# syntax=docker.io/docker/dockerfile:1

FROM node:21-alpine AS base

# The only build-time value: next.config.js inlines TEST_MODE into the bundle,
# so it cannot be changed at runtime. Everything else (NEXTAUTH_*, GOOGLE_*,
# BACK_URL) is read from process.env by server-only code and is a plain
# runtime environment variable.
ARG TEST_MODE=false


FROM base AS deps
# See https://github.com/nodejs/docker-node#nodealpine for why libc6-compat.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci


FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN TEST_MODE=$TEST_MODE npm run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# No root public/ dir: assets live in src/public and are imported as modules,
# so webpack emits them into .next/static.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
