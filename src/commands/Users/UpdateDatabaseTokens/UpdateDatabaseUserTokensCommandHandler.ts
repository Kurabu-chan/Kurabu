import { autoInjectable } from "tsyringe";
import { Database } from "../../../helpers/database/Database";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UpdateDatabaseUserTokensCommand } from "./UpdateDatabaseUserTokensCommand";
import { UpdateDatabaseUserTokensCommandResult } from "./UpdateDatabaseUserTokensCommandResult";

@autoInjectable()
export class UpdateDatabaseUserTokensCommandHandler implements ICommandHandler<UpdateDatabaseUserTokensCommand, UpdateDatabaseUserTokensCommandResult> {
    async handle(command: UpdateDatabaseUserTokensCommand): Promise<UpdateDatabaseUserTokensCommandResult> {
        const query = "UPDATE users SET token=$1, refreshtoken=$2 WHERE id=$3";
        const values = [command.token, command.refreshtoken, command.uuid]
        await Database
            .GetInstance()
            .ParamQuery(query, values);
            
        return {
            success: ICommandResultStatus.SUCCESS
        }
    }
}