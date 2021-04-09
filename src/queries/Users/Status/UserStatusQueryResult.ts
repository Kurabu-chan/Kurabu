import { UserStatus } from "../../../models/User";
import { IQueryResult } from "../../IQuery";

export class UserStatusQueryResult extends IQueryResult {
	status!: UserStatus;
}
