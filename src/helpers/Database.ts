import {
	Sequelize,
	SequelizeOptions,
} from "sequelize-typescript";
import { singleton } from "tsyringe";
import { Logger } from "@overnightjs/logger";
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
			models: ModelsArray,
				ssl: {
					rejectUnauthorized: false, // very important
				},
			},
			logging: false,
		};

		this._sequelize = new Sequelize(
			process.env.DATABASE_URL as string,
			sequelizeOptions
		);
		this._sequelize.databaseVersion().then((version) => {
			Logger.Info(`Database initialized with db version ${version}`);
		})
		.catch((err) => {
			Logger.Err(err)
		});
	}
}
