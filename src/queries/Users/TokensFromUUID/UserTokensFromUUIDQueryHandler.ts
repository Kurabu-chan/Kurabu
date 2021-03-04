import { autoInjectable } from "tsyringe";
import { CheckUserUUIDQueryHandler } from "../CheckUUID/CheckUserUUIDQueryHandler";
import { DictData, DictEntry, UserManager } from "../../../helpers/UserManager";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserLoginQueryResult } from "../Login/UserLoginQueryResult";
import { UserTokensFromUUIDQuery } from "./UserTokensFromUUIDQuery";
import { UserTokensFromUUIDQueryResult } from "./UserTokensFromUUIDQueryResult";

@autoInjectable()
export class UserTokensFromUUIDQueryHandler implements IQueryHandler<UserTokensFromUUIDQuery, UserTokensFromUUIDQueryResult> {
    constructor(private _userManager: UserManager,
        private _checkUserUUIDQuery: CheckUserUUIDQueryHandler) {
    }

    async handle({uuid}: UserTokensFromUUIDQuery): Promise<UserTokensFromUUIDQueryResult> {
        var result = await this._checkUserUUIDQuery.handle({
            uuid: uuid
        });

        let state = result.status;
        if (state == "done") {
            let dictEntry = <DictEntry>this._userManager.codeDict.get(uuid);
            let dictData = <DictData>dictEntry.data;
            return {
                success: IQueryResultStatus.SUCCESS,
                token: dictData.token,
                refreshtoken: dictData.RefreshToken
            };
        } else {
            throw new Error("Authentication is not done but " + state);
        }
    }
}