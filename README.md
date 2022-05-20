# Kurabu monorepo using turborepo

This is a monorepo containing all source for the kurabu project.

## Apps and Packages

-   `api`: an express api
-   `app`: a react-native/expo app
-   `config`: `eslint` configurations
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

## Root commands

The repo uses yarn for package management.

-   `yarn run build` used for building all apps (currently excluding app)
-   `yarn run dev` used for running all apps in dev mode (currently excluding app)
-   `yarn run lint` used for linting all projects (currently excluding app, config and tsconfig)
-   `yarn run format` used for formatting all ts, tsx and md files
-   `yarn run lint:fix` used for fixing lint in all projects (currently excluding app, config and tsconfig)

![Alt](https://repobeats.axiom.co/api/embed/9e476a2774c08f616ed2c8dea4d461eefa743403.svg "Repobeats analytics image")
