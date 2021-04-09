export abstract class ICommand {}

export abstract class ICommandResult {
	success!: ICommandResultStatus;
}

export enum ICommandResultStatus {
	SUCCESS,
	FAILURE,
}

export interface ICommandHandler<
	TCommand extends ICommand,
	TResult extends ICommandResult
> {
	handle(command: TCommand): Promise<TResult>;
}
