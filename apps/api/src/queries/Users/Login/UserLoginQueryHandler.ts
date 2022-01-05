import { autoInjectable } from "tsyringe";
import { UserStatusQueryHandler } from "../Status/UserStatusQueryHandler";
import { UserLoginQuery } from "./UserLoginQuery";
import { UserLoginQueryResult } from "./UserLoginQueryResult";
import { IQueryHandler, IQueryResultStatus } from "#queries/IQuery";
import BadLoginError from "#errors/Authentication/BadLoginError";
import TokensNotPresentError from "#errors/Authentication/TokensNotPresentError";
import { Database } from "#helpers/Database";
import * as hasher from "#helpers/Hasher";
import { Tokens } from "#models/Tokens";

@autoInjectable()
export class UserLoginQueryHandler implements IQueryHandler<UserLoginQuery, UserLoginQueryResult> {
    constructor(private database: Database, private _userStatus: UserStatusQueryHandler) {}

    async handle(query: UserLoginQuery): Promise<UserLoginQueryResult> {
        const user = await this.database.models.user.findOne({
            include: Tokens,
            where: {
                email: query.email,
            },
        });

        if (!user) throw new BadLoginError("Incorrect login");

        if ((await hasher.verify(query.password, user.pass)) === false)
            throw new BadLoginError("Incorrect login");

        if (!user.tokensId) throw new TokensNotPresentError("No tokens present on database");

        const tokens: Tokens = user.tokens as Tokens;

        if (!tokens.token || !tokens.refreshtoken)
            throw new TokensNotPresentError("No tokens during login");

        const status = await this._userStatus.handle({ user });

        return {
            email: user.email,
            id: user.id,
            refreshtoken: tokens.refreshtoken,
            status: status.status,
            success: IQueryResultStatus.success,
            token: tokens.token,
        };
    }
}
