import {
	ICommandHandler,
	ICommandResultStatus,
} from "#commands/ICommand";
import TokensNotPresentError
	from "#errors/Authentication/TokensNotPresentError";
import { CLIENT_ID } from "#helpers/GLOBALVARS";
import { getPKCE } from "#helpers/randomCodes";
import { ensureTokensOnUser } from "#models/Tokens";
import { autoInjectable } from "tsyringe";

import { ReAuthUserCommand } from "./ReAuthUserCommand";
import { ReAuthUserCommandResult } from "./ReAuthUserCommandResult";

@autoInjectable()
export class ReAuthUserCommandHandler
	implements ICommandHandler<ReAuthUserCommand, ReAuthUserCommandResult> {
	async handle(command: ReAuthUserCommand): Promise<ReAuthUserCommandResult> {
		const codeVerifier: string = getPKCE(128);
		const user = await ensureTokensOnUser(command.user);

		if (!user.tokens)
			throw new TokensNotPresentError("Something weird happened!");

		await user.tokens?.update({
			redirect: command.redirect,
			verifier: codeVerifier,
		});

		return {
			success: ICommandResultStatus.SUCCESS,
			url: `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeVerifier}&state=${
				command.uuid
			}&redirect_uri=${
				process.env.LOCALMODE
					? "http://localhost:15000/authed"
					: command.ourdomain + "/authed"
			}`,
		};
	}
}
