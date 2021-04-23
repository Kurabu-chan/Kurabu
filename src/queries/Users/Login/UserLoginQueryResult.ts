import { IQueryResult } from "../../IQuery";
import { UserStatus } from "../Status/UserStatusQueryHandler";

export class UserLoginQueryResult extends IQueryResult {
	id!: string;
	email!: string;
	token!: string;
	refreshtoken!: string;
	status!: UserStatus;
}
