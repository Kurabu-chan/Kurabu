import { autoInjectable } from "tsyringe";
import { PendingUserCommand } from "./PendingUserCommand";
import { PendingUserCommandResult } from "./PendingUserCommandResult";
import { ICommandHandler, ICommandResultStatus } from "#commands/ICommand";
import MissingStateError from "#errors/Authentication/MissingStateError";
import StateStatusError from "#errors/Authentication/StateStatusError";
import TokensNotPresentError from "#errors/Authentication/TokensNotPresentError";
import { Database } from "#helpers/Database";
import { Tokens } from "#models/Tokens";
import { UserStatus, UserStatusQueryHandler } from "#queries/Users/Status/UserStatusQueryHandler";
import { GetTokenWebRequestHandler } from "#webreq/Auth/GetToken/GetTokenWebRequestHandler";

@autoInjectable()
export class PendingUserCommandHandler
    implements ICommandHandler<PendingUserCommand, PendingUserCommandResult>
{
    constructor(
        private _getTokenWebRequest: GetTokenWebRequestHandler,
        private _database: Database,
        private _getUserStatus: UserStatusQueryHandler
    ) {}

    async handle(command: PendingUserCommand): Promise<PendingUserCommandResult> {
        // check if the uuid exists in the dict

        const db = this._database;
        const models = db.models;
        const usr = models.user;

        const user = await usr.findOne({
            include: Tokens,
            where: { id: command.uuid },
        });

        if (!user) throw new MissingStateError("uuid does not exist yet");

        const status = (await this._getUserStatus.handle({ user })).status;

        // get the dict entry and check if the state is pending
        if (status !== UserStatus.authing) throw new StateStatusError("uuid is not pending");

        const userTokens: Tokens = user.tokens as Tokens;

        const tokenModel = await this._database.models.tokens.findOne({
            where: {
                id: user.tokensId,
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

        if (userTokens.redirect) {
            return {
                success: ICommandResultStatus.success,
                url: `${userTokens.redirect}${command.uuid}`,
            };
        }
        return {
            success: ICommandResultStatus.success,
            url: `imal://auth/${command.uuid}`,
        };
    }
}
