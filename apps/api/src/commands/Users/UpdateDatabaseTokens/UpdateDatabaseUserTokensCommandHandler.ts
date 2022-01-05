import { autoInjectable } from "tsyringe";
import { UpdateDatabaseUserTokensCommand } from "./UpdateDatabaseUserTokensCommand";
import { UpdateDatabaseUserTokensCommandResult } from "./UpdateDatabaseUserTokensCommandResult";
import { ICommandHandler, ICommandResultStatus } from "#commands/ICommand";
import MissingStateError from "#errors/Authentication/MissingStateError";
import { Database } from "#helpers/Database";

@autoInjectable()
export class UpdateDatabaseUserTokensCommandHandler
    implements
        ICommandHandler<UpdateDatabaseUserTokensCommand, UpdateDatabaseUserTokensCommandResult>
{
    constructor(private database: Database) {}

    async handle(
        command: UpdateDatabaseUserTokensCommand
    ): Promise<UpdateDatabaseUserTokensCommandResult> {
        if (command.user === undefined)
            throw new MissingStateError("state doesn't belong to a user");

        if (command.user.tokensId === undefined) {
            const token = await this.database.models.tokens.create({
                refreshtoken: command.refreshtoken,
                token: command.token,
            });
            await command.user.update({
                tokens: token,
            });
        } else {
            await command.user.tokens?.update({
                refreshtoken: command.refreshtoken,
                token: command.token,
            });
        }

        return {
            success: ICommandResultStatus.success,
        };
    }
}
