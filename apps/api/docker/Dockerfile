ARG ARCH=

# Create a base section that later steps will use
FROM ${ARCH}node:16.18-alpine AS base

ENV YARN_VERSION 3.2.4
RUN yarn policies set-version $YARN_VERSION

RUN apk add git
RUN apk update

WORKDIR /app

# Create a layer for pruning the monorepo
FROM base AS pruner

# Copy the entire monorepo to the container
# An alternative would be copying only the desired app, and depended upon packages from the get go and not running turbo prune.
# This would be faster, but is less modular and requires editing the Dockerfile for each app.
# Simply personal preference here.
COPY . .
RUN yarn dlx turbo@1.5.5 prune --scope=@kurabu/api --docker

# Create a layer for installing modules
FROM base AS installer

# Add lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn install 

# Combine the layers into a fucntioning app.
FROM base AS builder

# Copy modules
COPY --from=installer /app/ .
# Copy pruned monorepo
COPY --from=pruner /app/out/full/ .
# Copy the gitignore
COPY .gitignore .gitignore

# Build api
RUN yarn turbo run build --scope=@kurabu/api --include-dependencies --no-deps --no-daemon

ENTRYPOINT [ "yarn", "turbo", "run", "start", "--scope=@kurabu/api", "--no-daemon" ]
