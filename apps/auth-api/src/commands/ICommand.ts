export interface ICommandHandler<TCommand extends ICommand, TResult extends ICommandResult> {
    handle(command: TCommand): Promise<TResult>;
}

export interface ICommand {

}

export interface ICommandResult {
    success: boolean
}
