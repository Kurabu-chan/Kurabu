import { IQueryResult } from "../../IQuery";

export class UserTokensFromUUIDQueryResult extends IQueryResult {
    token!: string;
    refreshtoken!: string;
}