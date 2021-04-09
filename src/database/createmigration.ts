import { SequelizeTypescriptMigration } from "sequelize-typescript-migration";
import { Sequelize, DataType } from "sequelize-typescript";
import * as path from "path";
import ModelsArray from "../models";
import { config } from "dotenv";
config();

async function createMigrationTable(sequelize: Sequelize) {
	const queryInterface = sequelize.getQueryInterface();
	await queryInterface.createTable("sequelizemeta", {
		name: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			primaryKey: true,
		},
	});
	await queryInterface.createTable("sequelizemetamigrations", {
		revision: {
			type: DataType.INTEGER,
			allowNull: false,
			unique: true,
			primaryKey: true,
		},
		name: {
			type: DataType.STRING,
			allowNull: false,
		},
		state: {
			type: DataType.JSON,
			allowNull: false,
		},
	});
}

(async () => {
	const sequelize = new Sequelize({
		username: "unsafe",
		password: "unsafe",
		database: "imaltest",
		host: "127.0.0.1",
		models: ModelsArray,
		dialect: "postgres",
	});
	createMigrationTable(sequelize);
	await SequelizeTypescriptMigration.makeMigration(sequelize as any, {
		outDir: path.join(__dirname, "./migrations"),
		migrationName: process.argv[2],
		preview: false,
	});
})();
