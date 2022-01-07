import * as path from "path";
import { config } from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { SequelizeStorage, Umzug } from "umzug";
import ModelsArray from "#models/index";

config();

void (async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        models: ModelsArray,
        quoteIdentifiers: false,
        storage: "migrations.db",
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

    await umzug.up();
})();
