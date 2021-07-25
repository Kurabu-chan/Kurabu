import { UserStatus } from "../Status/UserStatusQueryHandler";
import { IQueryResult } from "#queries/IQuery";

export class UserLoginQueryResult extends IQueryResult {
	id!: string;
	email!: string;
	token!: string;
	refreshtoken!: string;
	status!: UserStatus;
}
