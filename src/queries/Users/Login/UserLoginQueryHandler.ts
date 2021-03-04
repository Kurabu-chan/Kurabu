import BadLoginError from "../../../errors/Authentication/BadLoginError";
import { Database } from "../../../helpers/database/Database";
import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserLoginQuery } from "./UserLoginQuery";
import { UserLoginQueryResult } from "./USerLoginQueryResult";
import * as hasher from '../../../helpers/Hasher';
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserLoginQueryHandler implements IQueryHandler<UserLoginQuery, UserLoginQueryResult>{
    async handle(query: UserLoginQuery): Promise<UserLoginQueryResult> {
        let queryStr = "SELECT * FROM users WHERE EMail = $1;"
        let res = await Database
            .GetInstance()
            .ParamQuery(queryStr, [query.email]);

        if (res.rowCount === 0) throw new BadLoginError("Incorrect login");

        let entry = res.rows[0];
        if (await hasher.Verify(query.password, entry.pass) === false) throw new BadLoginError("Incorrect login");

        return {
            success: IQueryResultStatus.SUCCESS,
            id: entry.id,
            email: entry.email,
            token: entry.token,
            refreshtoken: entry.refreshtoken
        }
    }
}