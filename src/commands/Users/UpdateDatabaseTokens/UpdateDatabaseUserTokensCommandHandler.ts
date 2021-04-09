import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import { Database } from "../../../helpers/Database";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UpdateDatabaseUserTokensCommand } from "./UpdateDatabaseUserTokensCommand";
import { UpdateDatabaseUserTokensCommandResult } from "./UpdateDatabaseUserTokensCommandResult";

@autoInjectable()
export class UpdateDatabaseUserTokensCommandHandler implements ICommandHandler<UpdateDatabaseUserTokensCommand, UpdateDatabaseUserTokensCommandResult> {
    constructor(private database: Database){}

    async handle(command: UpdateDatabaseUserTokensCommand): Promise<UpdateDatabaseUserTokensCommandResult> {
        if(command.user === undefined) throw new MissingStateError("state doesn't belong to a user");

        if(command.user.tokensId == undefined){
            var token = await this.database.Models.tokens.create({
                token: command.token,
                refreshtoken: command.refreshtoken        
            });
            command.user.update({
                tokens: token
            })
        }else{
            command.user.tokens?.update({
                token: command.token,
                refreshtoken: command.refreshtoken
            });
        }

        return {
            success: ICommandResultStatus.SUCCESS
        }
    }
}