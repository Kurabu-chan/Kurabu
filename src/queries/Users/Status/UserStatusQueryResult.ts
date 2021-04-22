import { IQueryResult } from "../../IQuery";
import { UserStatus } from "./UserStatusQueryHandler";

export class UserStatusQueryResult extends IQueryResult {
	status!: UserStatus;
}
