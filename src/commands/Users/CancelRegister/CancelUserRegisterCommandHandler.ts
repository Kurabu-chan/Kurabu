import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { Database } from "../../../helpers/Database";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "../../../queries/Users/Status/UserStatusQueryHandler";
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
	constructor(
		private _database: Database,
		private _getUserStatus: UserStatusQueryHandler
	) {}

	async handle({
		user,
	}: CancelUserRegisterCommand): Promise<CancelUserRegisterCommandResult> {
		var status = await this._getUserStatus.handle({ user: user });

		if (!user) throw new MissingStateError("State missing during cancel");
		if (status.status == UserStatus.verif)
			throw new StateStatusError("State had wrong status during cancel");

		user.destroy();
		return {
			success: ICommandResultStatus.SUCCESS,
		};
	}
}
