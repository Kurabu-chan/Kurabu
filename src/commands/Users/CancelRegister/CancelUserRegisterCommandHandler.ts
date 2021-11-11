import { autoInjectable } from "tsyringe";
import { CancelUserRegisterCommand } from "./CancelUserRegisterCommand";
import {
	CancelUserRegisterCommandResult,
} from "./CancelUserRegisterCommandResult";
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
import { CheckUserUUIDQueryHandler } from "#queries/Users/CheckUUID/CheckUserUUIDQueryHandler";


@autoInjectable()
export class CancelUserRegisterCommandHandler
	implements
	ICommandHandler<
	CancelUserRegisterCommand,
	CancelUserRegisterCommandResult
	> {
	constructor(
		private _getUserStatus: UserStatusQueryHandler,
		private _checkUserUUIDQuery: CheckUserUUIDQueryHandler
	) { }

	async handle({
		state,
	}: CancelUserRegisterCommand): Promise<CancelUserRegisterCommandResult> {
		if (!state) throw new MissingStateError("State missing during cancel");

		const { user } = await this._checkUserUUIDQuery.handle({
			uuid: state
		});

		const status = await this._getUserStatus.handle({ user });
		if (status.status !== UserStatus.verif)
			throw new StateStatusError("State had wrong status during cancel");

		await user.destroy();
		return {
			success: ICommandResultStatus.success,
		};
	}
}
