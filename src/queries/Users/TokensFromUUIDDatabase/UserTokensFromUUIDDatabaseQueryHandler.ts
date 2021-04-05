import { autoInjectable } from "tsyringe";
import BadLoginError from "../../../errors/Authentication/BadLoginError";
import TokensNotPresentError from "../../../errors/Authentication/TokensNotPresentError";
import GeneralError from "../../../errors/GeneralError";
import { Database } from "../../../helpers/Database";
import { Tokens } from "../../../models/Tokens";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserTokensFromUUIDDatabaseQuery } from "./UserTokensFromUUIDDatabaseQuery";
import { UserTokensFromUUIDDatabaseQueryResult } from "./UserTokensFromUUIDDatabaseQueryResult";

@autoInjectable()
export class UserTokensFromUUIDDatabaseQueryHandler implements IQueryHandler<UserTokensFromUUIDDatabaseQuery, UserTokensFromUUIDDatabaseQueryResult> {
    constructor(private database: Database){}

    async handle(query: UserTokensFromUUIDDatabaseQuery): Promise<UserTokensFromUUIDDatabaseQueryResult> {

        var res = await this.database.Models.user.findOne({
            where: {id: query.uuid}
        });

        if (res === null) throw new BadLoginError("User doesn't exist");
        
        if(res.tokens === null) throw new TokensNotPresentError("No tokens present on database");

        var tokens: Tokens = (res.tokens as Tokens);

        return {
            success: IQueryResultStatus.SUCCESS,
            id: res.id,
            email: res.email,
            token: tokens.token,
            refreshtoken: tokens.refreshtoken
        }
    }
}