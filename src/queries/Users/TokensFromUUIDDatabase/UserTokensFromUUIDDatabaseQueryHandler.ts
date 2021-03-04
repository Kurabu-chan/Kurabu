import { autoInjectable } from "tsyringe";
import { Database } from "../../../helpers/database/Database";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserTokensFromUUIDDatabaseQuery } from "./UserTokensFromUUIDDatabaseQuery";
import { UserTokensFromUUIDDatabaseQueryResult } from "./UserTokensFromUUIDDatabaseQueryResult";

@autoInjectable()
export class UserTokensFromUUIDDatabaseQueryHandler implements IQueryHandler<UserTokensFromUUIDDatabaseQuery, UserTokensFromUUIDDatabaseQueryResult> {
    async handle(query: UserTokensFromUUIDDatabaseQuery): Promise<UserTokensFromUUIDDatabaseQueryResult> {
        let queryStr = "SELECT * FROM users WHERE id = $1;";
        let res = await Database
            .GetInstance()
            .ParamQuery(queryStr, [query.uuid]);

        if (res.rowCount === 0) throw new Error("User doesn't exist");

        let entry = res.rows[0];
        return {
            success: IQueryResultStatus.SUCCESS,
            id: entry.id,
            email: entry.email,
            token: entry.token,
            refreshtoken: entry.refreshtoken
        }
    }
}