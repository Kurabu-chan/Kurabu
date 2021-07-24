import { ICommandResult } from "#commands/ICommand";

export class PendingUserCommandResult extends ICommandResult {
	url!: string;
}
