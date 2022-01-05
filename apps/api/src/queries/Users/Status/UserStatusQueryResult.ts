import { UserStatus } from "./UserStatusQueryHandler";
import { IQueryResult } from "#queries/IQuery";

export class UserStatusQueryResult extends IQueryResult {
    status!: UserStatus;
}
