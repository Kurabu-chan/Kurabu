import BadLoginError from "../../../errors/Authentication/BadLoginError";
import { Database } from "../../../helpers/Database";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserLoginQuery } from "./UserLoginQuery";
import { UserLoginQueryResult } from "./UserLoginQueryResult";
import * as hasher from '../../../helpers/Hasher';
import { autoInjectable } from "tsyringe";
import MissingStateError from "../../../errors/Authentication/MissingStateError";
import GeneralError from "../../../errors/GeneralError";
import { Tokens } from "../../../models/Tokens";
import TokensNotPresentError from "../../../errors/Authentication/TokensNotPresentError";

@autoInjectable()
export class UserLoginQueryHandler implements IQueryHandler<UserLoginQuery, UserLoginQueryResult>{
    constructor(private database: Database){}

    async handle(query: UserLoginQuery): Promise<UserLoginQueryResult> {
        var user = await this.database.Models.user.findOne({
            where: {email: query.email}
        })

        if (user === null) throw new BadLoginError("Incorrect login");

        if (await hasher.Verify(query.password, user.pass) === false) throw new BadLoginError("Incorrect login");

        if(user.tokensId === undefined) throw new TokensNotPresentError("No tokens present on database");

        var tokens: Tokens = user.tokens as Tokens;

        return {
            success: IQueryResultStatus.SUCCESS,
            id: user.id,
            email: user.email,
            token: tokens.token,
            refreshtoken: tokens.refreshtoken
        }
    }
}