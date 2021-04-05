import { autoInjectable } from "tsyringe";
import { UserLoginQueryHandler } from "../../../queries/Users/Login/UserLoginQueryHandler";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { UserLoginCommand } from "./UserLoginCommand";
import { UserLoginCommandResult } from "./UserLoginCommandResult";

@autoInjectable()
export class UserLoginCommandHandler implements ICommandHandler<UserLoginCommand, UserLoginCommandResult>{
    constructor(
        private _userLoginQuery: UserLoginQueryHandler
    ) { }

    async handle({ email, password }: UserLoginCommand): Promise<UserLoginCommandResult> {
        var queryResult = await this._userLoginQuery.handle({
            email: email,
            password: password
        });

        return {
            success: ICommandResultStatus.SUCCESS,
            uuid: queryResult.id
        };
    }
}