import { autoInjectable } from "tsyringe";
import BadLoginError from "../../../errors/Authentication/BadLoginError";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import { Database } from "../../../helpers/Database";
import { User } from "../../../models/User";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UpdateDatabaseUserTokensCommand } from "./UpdateDatabaseUserTokensCommand";
import { UpdateDatabaseUserTokensCommandResult } from "./UpdateDatabaseUserTokensCommandResult";

@autoInjectable()
export class UpdateDatabaseUserTokensCommandHandler implements ICommandHandler<UpdateDatabaseUserTokensCommand, UpdateDatabaseUserTokensCommandResult> {
    constructor(private database: Database){}

    async handle(command: UpdateDatabaseUserTokensCommand): Promise<UpdateDatabaseUserTokensCommandResult> {
        var userRes = await this.database.Models.user.findOne({
            where: {id: command.uuid}
        });

        if(userRes === undefined) throw new MissingStateError("state doesn't belong to a user");

        if(userRes?.tokensId == undefined){
            var token = await this.database.Models.tokens.create({
                token: command.token,
                refreshtoken: command.refreshtoken        
            });
            userRes?.set("tokens", token)
        }else{
            userRes?.tokens?.set("token", command.token);
            userRes?.tokens?.set("refreshtoken", command.refreshtoken);
        }

        return {
            success: ICommandResultStatus.SUCCESS
        }
    }
}