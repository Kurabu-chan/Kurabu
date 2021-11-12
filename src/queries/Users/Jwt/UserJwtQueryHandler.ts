import { autoInjectable } from "tsyringe";
import * as jwt from "jsonwebtoken";
import { UserJwtQuery } from "./UserJwtQuery";
import { UserJwtQueryResult } from "./UserJwtQueryResult";
import { IQueryHandler, IQueryResultStatus } from "#queries/IQuery";
import { JWT_ENCRYPTION } from "#helpers/GLOBALVARS";

@autoInjectable()
export class UserJwtQueryHandler implements IQueryHandler<UserJwtQuery, UserJwtQueryResult>{
    handle(query: UserJwtQuery): Promise<UserJwtQueryResult> {
        return new Promise((resolve, reject) => {

            try {
                const token = jwt.sign({
                    id: query.uuid
                }, JWT_ENCRYPTION);
                resolve({
                    jwtToken: token,
                    success: IQueryResultStatus.success
                });
            } catch (error) {
                reject(error);
            }

        });
    }
}