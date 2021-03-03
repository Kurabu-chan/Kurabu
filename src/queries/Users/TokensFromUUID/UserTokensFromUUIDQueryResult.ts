import { IQueryResult } from "../../IQuery";

export class UserTokensFromUUIDQueryResult extends IQueryResult {
    id!: string;
    email!: string;
    token!: string;
    refreshtoken!: string;
}