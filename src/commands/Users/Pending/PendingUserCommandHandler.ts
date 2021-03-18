import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import { DictEntry, RegisterData, UserManager } from "../../../helpers/UserManager";
import { GetTokenWebRequestHandler } from "../../../webRequest/Auth/GetToken/GetTokenWebRequestHandler";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { CreateUserCommandHandler } from "../Create/CreateUserCommandHandler";
import { PendingUserCommand } from "./PendingUserCommand";
import { PendingUserCommandResult } from "./PendingUserCommandResult";

@autoInjectable()
export class PendingUserCommandHandler implements ICommandHandler<PendingUserCommand, PendingUserCommandResult> {
    constructor(
        private _userManager: UserManager,
        private _createUserCommand: CreateUserCommandHandler,
        private _getTokenWebRequest: GetTokenWebRequestHandler
    ) { }

    async handle(command: PendingUserCommand): Promise<PendingUserCommandResult> {
        //check if the uuid exists in the dict
        if (!this._userManager.codeDict.has(command.uuid)) throw new MissingStateError("uuid does not exist yet");

        //get the dict entry and check if the state is pending
        let dictEntry = <DictEntry>this._userManager.codeDict.get(command.uuid);
        if (dictEntry.state != "pending") throw new StateStatusError("uuid is not pending, it is: " + dictEntry.state);

        //get the dict data in the correct type
        let dictData = <RegisterData>dictEntry.data;
        //get the tokens from MAL

        let tokens = await this._getTokenWebRequest.handle({
            code: command.code,
            ourdomain: command.ourdomain,
            verifier: dictData.verifier
        });

        //All good so add user to the database and update codeDict
        await this._createUserCommand.handle({
            uuid: command.uuid,
            email: dictData.email,
            password: dictData.pass,
            refreshToken: tokens.refresh_token,
            token: tokens.access_token
        });

        this._userManager.codeDict.set(command.uuid, {
            state: "done",
            data: {
                token: tokens.access_token,
                RefreshToken: tokens.refresh_token,
                email: dictData.email
            }
        });

        if (dictData.redirect) {
            return {
                url: `${dictData.redirect}${command.uuid}`,
                success: ICommandResultStatus.SUCCESS
            }
        }
        return {
            url: `imal://auth/${command.uuid}`,
            success: ICommandResultStatus.SUCCESS
        }
    }
}