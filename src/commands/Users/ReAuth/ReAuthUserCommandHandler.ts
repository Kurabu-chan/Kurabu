import { autoInjectable } from "tsyringe";
import TokensNotPresentError from "../../../errors/Authentication/TokensNotPresentError";
import { CLIENT_ID } from "../../../helpers/GLOBALVARS";
import { getPKCE } from "../../../helpers/randomCodes";
import { ensureTokensOnUser } from "../../../models/Tokens";
import { ICommandHandler, ICommandResultStatus } from "../../ICommand"
import { ReAuthUserCommand } from "./ReAuthUserCommand";
import { ReAuthUserCommandResult } from "./ReAuthUserCommandResult";

@autoInjectable()
export class ReAuthUserCommandHandler implements ICommandHandler<ReAuthUserCommand, ReAuthUserCommandResult>{
    async handle(command: ReAuthUserCommand): Promise<ReAuthUserCommandResult> {
        let codeVerifier: string = getPKCE(128);
        var user = await ensureTokensOnUser(command.user);

        if(!user.tokens) throw new TokensNotPresentError("Something weird happened!");

        await user.tokens?.update({
            verifier: codeVerifier,
            redirect: command.redirect
        });

        return {
            success: ICommandResultStatus.SUCCESS,
            url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerifier}&state=${command.uuid}&redirect_uri=${process.env.LOCALMODE ? "http://localhost:15000/authed" : command.ourdomain + "/authed"}`
        }
    }
}