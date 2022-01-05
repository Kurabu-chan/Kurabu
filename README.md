# Kurabu monorepo using turborepo

This is a monorepo containing all source for the kurabu project.

## Apps and Packages

-   `api`: an express api
-   `app`: a react-native/expo app
-   `config`: `eslint` configurations
-   `tsconfig`: `tsconfig.json`s used throughout the monorepo

## Root commands

-   `npm run build` used for building all apps (currently excluding app)
-   `npm run dev` used for running all apps in dev mode (currently excluding app)
-   `npm run lint` used for linting all projects (currently excluding app, config and tsconfig)
-   `npm run format` used for formatting all ts, tsx and md files
-   `npm run lint:fix` used for fixing lint in all projects (currently excluding app, config and tsconfig)
