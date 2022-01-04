/* eslint-disable max-classes-per-file */
export abstract class ICommand {}

export abstract class ICommandResult {
	success!: ICommandResultStatus;
}

export enum ICommandResultStatus {
	success,
	failure,
}

export interface ICommandHandler<
	TCommand extends ICommand,
	TResult extends ICommandResult
> {
	handle(command: TCommand): Promise<TResult>;
}
