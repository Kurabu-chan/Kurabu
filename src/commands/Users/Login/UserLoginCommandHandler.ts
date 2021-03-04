import { autoInjectable } from "tsyringe";
import { DictEntry, UserManager } from "../../../helpers/UserManager";
import { UserLoginQueryHandler } from "../../../queries/Users/Login/UserLoginQueryHandler";
import { UserLoginQueryResult } from "../../../queries/Users/Login/USerLoginQueryResult";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UserLoginCommand } from "./UserLoginCommand";
import { UserLoginCommandResult } from "./UserLoginCommandResult";

@autoInjectable()
export class UserLoginCommandHandler implements ICommandHandler<UserLoginCommand, UserLoginCommandResult>{
    constructor(
        private _userManager: UserManager,
        private _userLoginQuery: UserLoginQueryHandler
    ) { }

    async handle({ email, password }: UserLoginCommand): Promise<UserLoginCommandResult> {
        var queryResult = await this._userLoginQuery.handle({
            email: email,
            password: password
        })

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
            success: ICommandResultStatus.SUCCESS,
            uuid: queryResult.id
        };
    }
}