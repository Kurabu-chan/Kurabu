export interface ICommandHandler<TCommand extends ICommand, TResult extends ICommandResult> {
    handle(Command: TCommand): Promise<TResult>;
}

export interface ICommand {

}

export interface ICommandResult {
    success: boolean
}
