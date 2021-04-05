import { autoInjectable } from "tsyringe";
import { Database } from "../../../helpers/Database";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserEmailUsedQuery } from "./UserEmailUsedQuery";
import { UserEmailUsedQueryResult } from "./UserEmailUsedQueryResult";

@autoInjectable()
export class UserEmailUsedQueryHandler implements IQueryHandler<UserEmailUsedQuery, UserEmailUsedQueryResult>{
    constructor(private database: Database){}

    async handle(query: UserEmailUsedQuery): Promise<UserEmailUsedQueryResult> {
        var count = await this.database.Models.user.count({
            where: {email: query.email}
        })

        return {
            emailIsUsed: count != 0,
            success: IQueryResultStatus.SUCCESS
        }
    }
}