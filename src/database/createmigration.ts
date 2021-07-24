import { config } from "dotenv";
import * as path from "path";
import {
	DataType,
	Sequelize,
} from "sequelize-typescript";
import { SequelizeTypescriptMigration } from "sequelize-typescript-migration";

import ModelsArray from "../models";

config();

async function createMigrationTable(sequelize: Sequelize) {
	const queryInterface = sequelize.getQueryInterface();
	await queryInterface.createTable("sequelizemeta", {
		name: {
			allowNull: false,
			primaryKey: true,
			type: DataType.STRING,
			unique: true,
		},
	});
	await queryInterface.createTable("sequelizemetamigrations", {
		name: {
			allowNull: false,
			type: DataType.STRING,
		},
		revision: {
			allowNull: false,
			primaryKey: true,
			type: DataType.INTEGER,
			unique: true,
		},
		state: {
			allowNull: false,
			type: DataType.JSON,
		},
	});
}

(async () => {
	const sequelize = new Sequelize({
		database: "imaltest",
		dialect: "postgres",
		host: "127.0.0.1",
		models: ModelsArray,
		password: "unsafe",
		username: "unsafe",
	});
	createMigrationTable(sequelize);
	await SequelizeTypescriptMigration.makeMigration(sequelize as any, {
		migrationName: process.argv[2],
		outDir: path.join(__dirname, "./migrations"),
		preview: false,
	});
})();
