[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Frafaeltab%2FiMal_API%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/rafaeltab/iMal_API/goto?ref=master) [![rafaeltab](https://circleci.com/gh/rafaeltab/iMal_API.svg?style=shield)](https://app.circleci.com/pipelines/github/rafaeltab) [![Total alerts](https://img.shields.io/lgtm/alerts/g/rafaeltab/iMal_API.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rafaeltab/iMal_API/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/rafaeltab/iMal_API.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rafaeltab/iMal_API/context:javascript) ![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/rafaeltab/cf4e0afd95dc722d3ccf24fbe8a5775b/raw/iMal_API__heads_main.json)

# iMAL2.0

Soon to be renamed to kurabu inside code hopefully some time :)

# migrations

-   edit or create some models
    -   if model was added add it to `src/models/index.ts`
-   make sure there is a config.json file present in `src/database/config`
    -   if not present check sequelize docs on what format it has and **create it by hand**
    -   make sure that development is set to a **local database** if you don't make sure to change the env used in the next step
-   run `npx sequelize-cli db:migrate --env development`
-   run `npm run db:addmigration`

Your local db should not be up-to-date

After commiting and having the pull request started

-   ensure that the staging database is also in the `config.json` from earlier under the environment `staging`
-   run `npm sequelize-cli db:migrate --env staging`
-   test if everything works
