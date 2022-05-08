ARG ARCH=

# Create a base section that later steps will use
FROM ${ARCH}node:17-alpine AS base

ENV YARN_VERSION 1.22.17
RUN yarn policies set-version $YARN_VERSION

RUN apk add git
RUN apk update

WORKDIR /app

# Create a layer for pruning the monorepo
FROM base AS pruner

RUN yarn global add turbo
# Copy the entire monorepo to the container
# An alternative would be copying only the desired app, and depended upon packages from the get go and not running turbo prune.
# This would be faster, but is less modular and requires editing the Dockerfile for each app.
# Simply personal preference here.
COPY . .
RUN turbo prune --scope=@kurabu/auth-api --docker

# Create a layer for installing modules
FROM base AS installer

# Add lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

# Use pure lockfile for faster install
RUN yarn install --pure-lockfile

# Combine the layers into a fucntioning app.
FROM base AS builder

# Copy modules
COPY --from=installer /app/ .
# Copy pruned monorepo
COPY --from=pruner /app/out/full/ .
# Copy the gitignore
COPY .gitignore .gitignore

# Build api
RUN yarn turbo run build --scope=@kurabu/auth-api --include-dependencies --no-deps

ENTRYPOINT [ "yarn", "turbo", "run", "start", "--scope=@kurabu/auth-api" ]
