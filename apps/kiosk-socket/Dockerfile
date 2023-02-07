# base node image
FROM node:18-bullseye-slim as base
RUN npm install -g node-gyp turbo

FROM base as pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=kiosk-socket --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
RUN chmod +x /app/scripts/cleanup-extensions.sh
RUN /app/scripts/cleanup-extensions.sh /app/out

# Base strategy to have layer caching
FROM base AS project
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock


FROM project as deps
WORKDIR /app
RUN corepack enable
COPY /patches ./patches
RUN yarn install --frozen-lockfile

# Setup production node_modules
FROM project as production-deps
WORKDIR /app
RUN corepack enable
COPY /patches ./patches
RUN yarn install --production

# Build the app
FROM project as builder
ARG TURBO_TOKEN
ARG TURBO_TEAM

ENV NODE_ENV=production
WORKDIR /app

COPY --from=pruner /app/out/full/ /app
COPY --from=deps /app/node_modules /app/node_modules
COPY turbo.json turbo.json
COPY .env .env

# If we're using Prisma, uncomment to cache the prisma schema
# ADD prisma .
# RUN npx prisma generate

# Build the project
# Remote caching is disabled in docker context.
# However before start building Docker image we must check it already!
RUN turbo run build --filter=kiosk-socket...

# Finally, build the production image with minimal footprint
FROM base as runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app
RUN chown -R app:nodejs /app
USER app

COPY --from=pruner --chown=app:nodejs /app/out/full/ .
COPY --from=production-deps --chown=app:nodejs /app .
COPY --from=builder --chown=app:nodejs /app/apps/kiosk-socket/dist ./apps/kiosk-socket/dist

CMD ["yarn", "workspace", "kiosk-socket", "run", "start"]
