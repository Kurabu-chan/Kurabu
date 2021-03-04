import { autoInjectable } from "tsyringe";
import { DictData, DictEntry, UserManager } from "../../../helpers/UserManager";
import { UserTokensFromUUIDQueryHandler } from "../../../queries/Users/TokensFromUUID/UserTokensFromUUIDQueryHandler";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UpdateDatabaseUserTokensCommandHandler } from "../UpdateDatabaseTokens/UpdateDatabaseUserTokensCommandHandler";
import { UpdateUserTokensCommand } from "./UpdateUserTokensCommand";
import { UpdateUserTokensCommandResult } from "./UpdateUserTokensCommandResult";

@autoInjectable()
export class UpdateUserTokensCommandHandler implements ICommandHandler<UpdateUserTokensCommand, UpdateUserTokensCommandResult> {
    /**
     *
     */
    constructor(
        private _userManager: UserManager,
        private _updateDatabaseUserTokensCommand: UpdateDatabaseUserTokensCommandHandler,
        private _userTokensFromUUIDQuery: UserTokensFromUUIDQueryHandler
    ) {
    }

    async handle({ token, refreshtoken, uuid }: UpdateUserTokensCommand): Promise<UpdateUserTokensCommandResult> {
        //check if the tokens have changed
        let tokens = await this._userTokensFromUUIDQuery.handle({ uuid });
        if (tokens.token != token || tokens.refreshtoken != refreshtoken) {
            let dictEntry = <DictEntry>this._userManager.codeDict.get(uuid);

            let curr = <DictData>dictEntry.data;
            curr.token = token;
            curr.RefreshToken = refreshtoken;

            this._userManager.codeDict.set(uuid, { state: dictEntry.state, data: curr });

            //Update token in database
            await this._updateDatabaseUserTokensCommand.handle({
                refreshtoken: refreshtoken,
                token: token,
                uuid: uuid
            });
        }

        return {
            success: ICommandResultStatus.SUCCESS
        }
    }
}