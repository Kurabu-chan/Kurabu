import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import StateStatusError from "../../../errors/Authentication/StateStatusError";
import TokensNotPresentError from "../../../errors/Authentication/TokensNotPresentError";
import { Database } from "../../../helpers/Database";
import { Tokens } from "../../../models/Tokens";
import { GetTokenWebRequestHandler } from "../../../webRequest/Auth/GetToken/GetTokenWebRequestHandler";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand";
import { PendingUserCommand } from "./PendingUserCommand";
import { PendingUserCommandResult } from "./PendingUserCommandResult";

@autoInjectable()
export class PendingUserCommandHandler implements ICommandHandler<PendingUserCommand, PendingUserCommandResult> {
    constructor(
        private _getTokenWebRequest: GetTokenWebRequestHandler,
        private _database: Database
    ) { }

    async handle(command: PendingUserCommand): Promise<PendingUserCommandResult> {
        //check if the uuid exists in the dict
        var user = await this._database.Models.user.findOne({
            where: {id: command.uuid},
            include: {
                model: Tokens,
                attributes: ["token", "refreshtoken", "verifier", "redirect"]
            }
        });

        if (!user) throw new MissingStateError("uuid does not exist yet");

        //get the dict entry and check if the state is pending
        if ( !user.tokens || !user.tokens.verifier) throw new StateStatusError("uuid is not pending");

        //get the tokens from MAL
        let tokens = await this._getTokenWebRequest.handle({
            code: command.code,
            ourdomain: command.ourdomain,
            verifier: user.tokens.verifier
        });

        var tokenModel = await this._database.Models.tokens.findOne({
            where: {
                id: user.tokensId
            }
        })
        if(!tokenModel) throw new TokensNotPresentError("No tokens for pending user");
        await tokenModel.update({
            token: tokens.access_token,
            refreshtoken: tokens.refresh_token,
            verifier: undefined,
            redirect: undefined
        });

        if (user.tokens.redirect) {
            return {
                url: `${user.tokens.redirect}${command.uuid}`,
                success: ICommandResultStatus.SUCCESS
            }
        }
        return {
            url: `imal://auth/${command.uuid}`,
            success: ICommandResultStatus.SUCCESS
        }
    }
}