import * as path from "path";
import { config } from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug } from "umzug";
import ModelsArray from "#models/index";

config();

void (async () => {
    const sequelize = new Sequelize({
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false, // very important
            },
        },
        logging: false,
        models: ModelsArray,
    });

    const umzug = new Umzug({
        context: sequelize.getQueryInterface(),
        logger: console,
        migrations: {
            glob: path.join(__dirname, "./migrations/*.js"),
        },
        storage: new SequelizeStorage({
            sequelize,
        }),
    });

    const allMigrations = umzug.migrations(sequelize.getQueryInterface());
    const migrationNames = (await allMigrations).map(x => x.name);
    // eslint-disable-next-line no-console
    console.log(migrationNames.map((x,i) => `${i+1}: ${x}`).join("\n"));
})();
