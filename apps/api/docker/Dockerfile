ARG ARCH=

FROM ${ARCH}node:alpine AS base

ENV YARN_VERSION 1.22.17
RUN yarn policies set-version $YARN_VERSION

RUN apk add git
RUN apk update
# Set working directory
WORKDIR /app


FROM base AS builder

RUN yarn global add turbo
# Copy the entire monorepo to the container
# An alternative would be copying only the desired app, and depended upon packages from the get go and not running turbo prune.
# This would be faster, but is less modular and requires editing the Dockerfile for each app.
# Simply personal preference here.
COPY . .
RUN turbo prune --scope=@kurabu/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

FROM base AS sourcer

COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build --scope=@kurabu/api --include-dependencies --no-deps

ENTRYPOINT [ "yarn", "turbo", "run", "start", "--scope=@kurabu/api" ]