import { IQueryResult } from "../../IQuery";

export class UserTokensFromUUIDDatabaseQueryResult extends IQueryResult {
    id!: string;
    email!: string;
    token!: string;
    refreshtoken!: string;
}