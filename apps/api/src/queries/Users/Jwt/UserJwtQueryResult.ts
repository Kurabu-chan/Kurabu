import { IQueryResult } from "#queries/IQuery";

export class UserJwtQueryResult extends IQueryResult {
    jwtToken!: string;
}
