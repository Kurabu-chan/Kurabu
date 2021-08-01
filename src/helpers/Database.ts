import path = require("path");
import { readdir } from "fs";
import {
	Sequelize,
	SequelizeOptions,
} from "sequelize-typescript";
import { singleton } from "tsyringe";
import { Logger } from "@overnightjs/logger";
import * as Umzug from "umzug";
import * as DeepDiff from "deep-diff";
import ModelsArray, {
	models,
	ModelsType,
} from "#models/index";

export type UserDatabaseEntry = {
	id: string;
	email: string;
	token: string;
	refreshtoken: string;
};

@singleton()
export class Database {
	private _sequelize!: Sequelize;
	private _models!: ModelsType;

	get sequelize(): Sequelize {
		return this._sequelize;
	}

	get models(): ModelsType {
		return this._models;
	}

	constructor() {
		this._models = models;
		const sequelizeOptions: SequelizeOptions = {
			dialect: "postgres",
			dialectOptions: {
				ssl: {
					rejectUnauthorized: false, // very important
				},
			},
			logging: false,
			models: ModelsArray,
		};

		this._sequelize = new Sequelize(
			process.env.DATABASE_URL as string,
			sequelizeOptions
		);
		this._sequelize.databaseVersion().then((version) => {
			Logger.Info(`Databases initialized with db version ${version}`);
		})
		.catch((err) => {
			Logger.Err(err)
		});

		void this.migrate();
	}

	private async migrate() {
		let consoleMessages = "";
		await (async () => {
			consoleMessages += "Checking migrations\n";
			const [results] = await this._sequelize.query("SELECT * FROM \"SequelizeMeta\"", {
				raw: true,
			});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
			const presentMigrations: string[] = (results as any[]).map(x => x.name);

			const migrationsPath = path.join(process.cwd(), "./src/database/migrations");
			const availableMigrations = await aReaddir(migrationsPath);

			const diff = DeepDiff.diff(presentMigrations, availableMigrations);

			if (diff !== undefined && diff?.filter(x => x.kind === "D").length > 0) {
				throw new Error("Found migration on database that was not present on server");
			}

			for(const present of presentMigrations){
				consoleMessages += `\t✔ ${present}\n`;
			}

			if (diff === undefined) {
				return;
			}

			for (const notPresent of diff?.filter(x => x.kind === "A")) {
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
				consoleMessages += `\t❌ ${(notPresent as any).item.rhs}\n`
			}

			// eslint-disable-next-line max-len
			consoleMessages += "Since there were unapplied migrations detected we are now migrating the database to the latest version\n";

			const umzug = new Umzug({
				migrations: {
					params: [
						this._sequelize.getQueryInterface(),
						this._sequelize
					],
					path: migrationsPath,
				},
				storage: "sequelize",
				storageOptions: {
					sequelize: this._sequelize
				}
			});

			void umzug.up();
		})();

		Logger.Info(consoleMessages);
	}
}

function aReaddir(p: string):Promise<string[]> {
	return new Promise((resolve) => {
		readdir(p, (err, files) => {
			if (err) throw err;
			resolve(files);
		})
	});
}
