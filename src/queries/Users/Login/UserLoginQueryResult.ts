import { UserStatus } from "../../../models/User";
import { IQueryResult } from "../../IQuery";

export class UserLoginQueryResult extends IQueryResult {
	id!: string;
	email!: string;
	token!: string;
	refreshtoken!: string;
	status!: UserStatus;
}
