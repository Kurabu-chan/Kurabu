import { autoInjectable } from "tsyringe";
import { DictEntry, UserManager } from "../../../helpers/UserManager";
import { UserTokensFromUUIDDatabaseQueryHandler } from "../TokensFromUUIDDatabase/UserTokensFromUUIDDatabaseQueryHandler";
import { ICommandHandler, ICommandResultStatus } from "../../../commands/ICommand";
import { CheckUserUUIDQuery } from "./CheckUserUUIDQuery";
import { CheckUserUUIDQueryResult } from "./CheckUserUUIDQueryResult";

@autoInjectable()
export class CheckUserUUIDQueryHandler implements ICommandHandler<CheckUserUUIDQuery, CheckUserUUIDQueryResult> {
    private _userManager: UserManager;
    private _userTokensFromUUIDQuery: UserTokensFromUUIDDatabaseQueryHandler;
    constructor(
        userManager: UserManager, userTokensFromUUIDQuery: UserTokensFromUUIDDatabaseQueryHandler,
    ) {
        this._userTokensFromUUIDQuery = userTokensFromUUIDQuery;
        this._userManager = userManager;
    }

    async handle(command: CheckUserUUIDQuery): Promise<CheckUserUUIDQueryResult> {
        if (this._userManager.codeDict.has(command.uuid)) {
            let entry = <DictEntry>this._userManager.codeDict.get(command.uuid);
            return {
                success: ICommandResultStatus.SUCCESS,
                status: entry.state
            };
        }

        var queryResult = await this._userTokensFromUUIDQuery.handle({ uuid: command.uuid })

        let dictEntry: DictEntry = {
            state: "done",
            data: {
                email: queryResult.email,
                token: queryResult.token,
                RefreshToken: queryResult.refreshtoken
            }
        }
        this._userManager.codeDict.set(queryResult.id, dictEntry);
        return {
            status: "done",
            success: ICommandResultStatus.SUCCESS
        };
    }
}