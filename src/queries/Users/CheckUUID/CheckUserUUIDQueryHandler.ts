import {
	ICommandHandler,
	ICommandResultStatus,
} from "#commands/ICommand";
import MissingStateError from "#errors/Authentication/MissingStateError";
import { Database } from "#helpers/Database";
import { Tokens } from "#models/Tokens";
import { autoInjectable } from "tsyringe";

import { CheckUserUUIDQuery } from "./CheckUserUUIDQuery";
import { CheckUserUUIDQueryResult } from "./CheckUserUUIDQueryResult";

@autoInjectable()
export class CheckUserUUIDQueryHandler
	implements ICommandHandler<CheckUserUUIDQuery, CheckUserUUIDQueryResult> {
	constructor(private _database: Database) {}

	async handle(command: CheckUserUUIDQuery): Promise<CheckUserUUIDQueryResult> {
		var user = await this._database.Models.user.findOne({
			where: { id: command.uuid },
			include: Tokens,
		});
		if (user) {
			return {
				success: ICommandResultStatus.SUCCESS,
				user: user,
			};
		} else {
			//TODO better error
			throw new MissingStateError("user doesn't exist");
		}
	}
}
