import { autoInjectable } from "tsyringe";
import { ReAuthUserCommand } from "./ReAuthUserCommand";
import { ReAuthUserCommandResult } from "./ReAuthUserCommandResult";
import { ICommandHandler, ICommandResultStatus } from "#commands/ICommand";
import TokensNotPresentError from "#errors/Authentication/TokensNotPresentError";
import { CLIENT_ID } from "#helpers/GLOBALVARS";
import { getPKCE } from "#helpers/randomCodes";
import { ensureTokensOnUser } from "#models/Tokens";
import { RequestBuilder } from "#builders/requests/RequestBuilder";
import { UserJwtQueryHandler } from "#queries/Users/Jwt/UserJwtQueryHandler";

@autoInjectable()
export class ReAuthUserCommandHandler
    implements ICommandHandler<ReAuthUserCommand, ReAuthUserCommandResult>
{
	constructor(private _userJwtQuery: UserJwtQueryHandler) {}

    async handle(command: ReAuthUserCommand): Promise<ReAuthUserCommandResult> {
        const codeVerifier: string = getPKCE(128);
        const user = await ensureTokensOnUser(command.user);

        if (!user.tokens) throw new TokensNotPresentError("Something weird happened!");

        await user.tokens?.update({
            redirect: command.redirect,
            verifier: codeVerifier,
		});

		let redirectIdentifier = command.uuid;

		if (command.isJwt) {
			const jwt = await this._userJwtQuery.handle({
				uuid: command.uuid,
			});

			redirectIdentifier = jwt.jwtToken;
		}

        const request = new RequestBuilder("https", "myanimelist.net")
            .addPath("v1/oauth2/authorize")
            .setQueryParam("response_type", "code")
            .setQueryParam("client_id", CLIENT_ID)
            .setQueryParam("code_challenge", codeVerifier)
			.setQueryParam("state", redirectIdentifier);

        if (process.env.LOCALMODE) {
            request.setQueryParam("redirect_uri", "http://localhost:15000/authed");
        } else {
            request.setQueryParam("redirect_uri", command.ourdomain + "/authed");
        }

        const url = request.build().url;

        return {
            success: ICommandResultStatus.success,
            url,
        };
    }
}
