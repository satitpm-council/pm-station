# base node image
FROM node:16-bullseye-slim as base
# Install openssl for Prisma
RUN apt-get update && apt-get -qq install -y openssl
# Necessary for running Python
RUN apt-get -qq install -y curl python3-pip python3-dev make g++
RUN npm install -g node-gyp turbo


FROM base as pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=client-web --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Base strategy to have layer caching
FROM base AS project
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY --from=pruner /app/out/full/apps/client-web/requirements.txt /app/apps/client-web/requirements.txt


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

ENV NODE_ENV=production
WORKDIR /app

COPY --from=pruner /app/out/full/ /app
COPY --from=deps /app/node_modules /app/node_modules
COPY turbo.json turbo.json

# If we're using Prisma, uncomment to cache the prisma schema
# ADD prisma .
# RUN npx prisma generate

# Build the project
# Remote caching is disabled in docker context.
# However before start building Docker image we must check it already!
RUN turbo run build --filter=client-web...

# Finally, build the production image with minimal footprint
FROM base as runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remixjs
RUN chown -R remixjs:nodejs /app
USER remixjs

COPY --from=pruner --chown=remixjs:nodejs /app/out/full/ .
COPY --from=production-deps --chown=remixjs:nodejs /app .
COPY --from=builder --chown=remixjs:nodejs /app/apps/client-web/build ./apps/client-web/build
COPY --from=builder --chown=remixjs:nodejs /app/apps/client-web/public ./apps/client-web/public

RUN yarn workspace client-web run bootstrap

CMD ["yarn", "workspace", "client-web", "run", "start"]
