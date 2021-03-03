import { autoInjectable } from "tsyringe";
import { Database } from "../../../helpers/database/Database";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserEmailUsedQuery } from "./UserEmailUsedQuery";
import { UserEmailUsedQueryResult } from "./UserEmailUsedQueryResult";

@autoInjectable()
export class UserEmailUsedQueryHandler implements IQueryHandler<UserEmailUsedQuery, UserEmailUsedQueryResult>{
    async handle(query: UserEmailUsedQuery): Promise<UserEmailUsedQueryResult> {
        const queryStr = "SELECT COUNT(*) FROM users WHERE email = $1;";
        const queryValues = [query.email];

        const res = await Database
            .GetInstance()
            .ParamQuery(queryStr, queryValues);

        return {
            emailIsUsed: res.rows[0].count != 0,
            success: IQueryResultStatus.SUCCESS
        }
    }
}