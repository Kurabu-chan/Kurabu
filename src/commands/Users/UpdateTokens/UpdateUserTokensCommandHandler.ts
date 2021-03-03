import { autoInjectable } from "tsyringe";
import { Database } from "../../../helpers/database/Database";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UpdateUserTokensCommand } from "./UpdateUserTokensCommand";
import { UpdateUserTokensCommandResult } from "./UpdateUserTokensCommandResult";

@autoInjectable()
export class UpdateUserTokensCommandHandler implements ICommandHandler<UpdateUserTokensCommand, UpdateUserTokensCommandResult> {
    async handle(command: UpdateUserTokensCommand): Promise<UpdateUserTokensCommandResult> {
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