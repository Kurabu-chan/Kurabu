import ModelsArray, {
	Models,
	ModelsType,
} from "#models/index";
import {
	Sequelize,
	SequelizeOptions,
} from "sequelize-typescript";
import { singleton } from "tsyringe";

export type UserDatabaseEntry = {
	id: string;
	email: string;
	token: string;
	refreshtoken: string;
};

@singleton()
export class Database {
	private sequelize!: Sequelize;
	private models!: ModelsType;

	get Sequelize() {
		return this.sequelize;
	}

	get Models() {
		return this.models;
	}

	constructor() {
		this.models = Models;
		var sequelizeOptions: SequelizeOptions = {
			models: ModelsArray,
			dialect: "postgres",
			dialectOptions: {
				ssl: {
					rejectUnauthorized: false, // very important
				},
			},
			logging: false,
		};

		this.sequelize = new Sequelize(
			process.env.DATABASE_URL as string,
			sequelizeOptions
		);
		this.sequelize.databaseVersion().then((version) => {
			console.log(`Database initialized with db version ${version}`);
		});
	}
}
