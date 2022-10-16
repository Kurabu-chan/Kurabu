import { autoInjectable } from "tsyringe";
import { PendingUserCommand } from "./PendingUserCommand";
import { PendingUserCommandResult } from "./PendingUserCommandResult";
import { ICommandHandler, ICommandResultStatus } from "#commands/ICommand";
import MissingStateError from "#errors/Authentication/MissingStateError";
import StateStatusError from "#errors/Authentication/StateStatusError";
import TokensNotPresentError from "#errors/Authentication/TokensNotPresentError";
import { Database } from "#helpers/Database";
import { Tokens } from "#models/Tokens";
import { UserJwtQueryHandler } from "#queries/Users/Jwt/UserJwtQueryHandler";
import { UserStatus, UserStatusQueryHandler } from "#queries/Users/Status/UserStatusQueryHandler";
import { GetTokenWebRequestHandler } from "#webreq/Auth/GetToken/GetTokenWebRequestHandler";

@autoInjectable()
export class PendingUserCommandHandler
	implements ICommandHandler<PendingUserCommand, PendingUserCommandResult>
{
	constructor(
		private _getTokenWebRequest: GetTokenWebRequestHandler,
		private _database: Database,
		private _getUserStatus: UserStatusQueryHandler,
		private _userJwtQuery: UserJwtQueryHandler
	) { }

	async handle(command: PendingUserCommand): Promise<PendingUserCommandResult> {
		// check if the uuid exists in the dict

		const db = this._database;
		const models = db.models;
		const usr = models.user;

		const user = await usr.findOne({
			include: Tokens,
			where: { userId: command.uuid },
		});

		if (!user) throw new MissingStateError("uuid does not exist yet");

		const status = (await this._getUserStatus.handle({ user })).status;

		// get the dict entry and check if the state is pending
		if (status !== UserStatus.authing) throw new StateStatusError("uuid is not pending");

		const userTokens: Tokens = user.tokens as Tokens;

		const tokenModel = await this._database.models.tokens.findOne({
			where: {
				tokensId: user.tokensId,
			},
		});
		if (!tokenModel) throw new TokensNotPresentError("No tokens for pending user");

		// get the tokens from MAL
		const tokens = await this._getTokenWebRequest.handle({
			code: command.code,
			ourdomain: command.ourdomain,
			verifier: userTokens.verifier as string,
		});

		await tokenModel.update({
			redirect: null,
			refreshtoken: tokens.refreshToken,
			token: tokens.accessToken,
			verifier: null,
		});

		let redirectIdentifier = command.uuid;

		if (command.isJwt) {
			redirectIdentifier = (await this._userJwtQuery.handle({
				uuid: command.uuid,
			})).jwtToken;
		}

		if (userTokens.redirect) {
			if (userTokens.redirect.endsWith("//")) {
				return {
					success: ICommandResultStatus.success,
					url: `${userTokens.redirect}${redirectIdentifier}`
				};
			}

			return {
				success: ICommandResultStatus.success,
				url: new URL(redirectIdentifier, userTokens.redirect).href,
			};
		}
		return {
			success: ICommandResultStatus.success,
			url: new URL(redirectIdentifier, "kurabu://auth/").href,
		};
	}
}
