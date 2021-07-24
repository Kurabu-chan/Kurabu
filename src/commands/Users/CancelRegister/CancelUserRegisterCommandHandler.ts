import {
	ICommandHandler,
	ICommandResultStatus,
} from "#commands/ICommand";
import MissingStateError from "#errors/Authentication/MissingStateError";
import StateStatusError from "#errors/Authentication/StateStatusError";
import {
	UserStatus,
	UserStatusQueryHandler,
} from "#queries/Users/Status/UserStatusQueryHandler";
import { autoInjectable } from "tsyringe";

import { CancelUserRegisterCommand } from "./CancelUserRegisterCommand";
import {
	CancelUserRegisterCommandResult,
} from "./CancelUserRegisterCommandResult";

@autoInjectable()
export class CancelUserRegisterCommandHandler
	implements
		ICommandHandler<
			CancelUserRegisterCommand,
			CancelUserRegisterCommandResult
		> {
	constructor(private _getUserStatus: UserStatusQueryHandler) {}

	async handle({
		user,
	}: CancelUserRegisterCommand): Promise<CancelUserRegisterCommandResult> {
		if (!user) throw new MissingStateError("State missing during cancel");

		const status = await this._getUserStatus.handle({ user });
		if (status.status !== UserStatus.verif)
			throw new StateStatusError("State had wrong status during cancel");

		user.destroy();
		return {
			success: ICommandResultStatus.SUCCESS,
		};
	}
}
