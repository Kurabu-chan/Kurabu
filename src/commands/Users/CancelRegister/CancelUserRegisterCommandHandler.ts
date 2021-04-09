import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { Database } from "../../../helpers/Database";
import { getStatus, UserStatus } from "../../../models/User";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { CancelUserRegisterCommand } from "./CancelUserRegisterCommand";
import { CancelUserRegisterCommandResult } from "./CancelUserRegisterCommandResult";

@autoInjectable()
export class CancelUserRegisterCommandHandler
	implements
		ICommandHandler<
			CancelUserRegisterCommand,
			CancelUserRegisterCommandResult
		> {
	constructor(private _database: Database) {}

	async handle({
		user,
	}: CancelUserRegisterCommand): Promise<CancelUserRegisterCommandResult> {
		if (!user) throw new MissingStateError("State missing during cancel");
		if ((await getStatus(user)) == UserStatus.verif)
			throw new StateStatusError("State had wrong status during cancel");

		user.destroy();
		return {
			success: ICommandResultStatus.SUCCESS,
		};
	}
}
