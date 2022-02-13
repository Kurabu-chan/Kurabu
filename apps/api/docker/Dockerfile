ARG ARCH=

FROM ${ARCH}node:alpine AS builder

ENV YARN_VERSION 1.22.17
RUN yarn policies set-version $YARN_VERSION

RUN apk add git
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
RUN yarn global add turbo
RUN turbo prune --scope=@kurabu/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM ${ARCH}node:alpine AS installer

ENV YARN_VERSION 1.22.17
RUN yarn policies set-version $YARN_VERSION

# RUN apk add gcc g++ git python2 make
RUN apk add git
RUN apk update

WORKDIR /app
COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

FROM ${ARCH}node:alpine AS sourcer

ENV YARN_VERSION 1.22.17
RUN yarn policies set-version $YARN_VERSION

# RUN apk add gcc g++ git python3
RUN apk add git
RUN apk update

WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN yarn turbo run build --scope=@kurabu/api --include-dependencies --no-deps

ENTRYPOINT [ "yarn", "turbo", "run", "start", "--scope=@kurabu/api" ]