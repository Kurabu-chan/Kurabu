import * as path from "path";
import { config } from "dotenv";
import {
	Sequelize,
} from "sequelize-typescript";
import {
	SequelizeTypescriptMigration,
} from "sequelize-typescript-migration-rafaeltab";
import * as Umzug from "umzug";
import ModelsArray from "#models/index";

config();

void (async () => {
	const sequelize = new Sequelize({
		dialect: "sqlite",
		models: ModelsArray,
		quoteIdentifiers: false,
		storage: "migrations.db",
	});
	// await createMigrationTable(sequelize);
	await SequelizeTypescriptMigration.makeMigration(sequelize as any, {
		migrationName: process.argv[2],
		outDir: path.join(__dirname, "./migrations"),
		preview: false,
	});

	const umzug = new Umzug({
		migrations: {
			params: [sequelize.getQueryInterface(), sequelize],
			path: path.join(__dirname, "./migrations"),
		},
		storage: "sequelize",
		storageOptions: {
			sequelize,
		},
	});

	await umzug.up();
})();
