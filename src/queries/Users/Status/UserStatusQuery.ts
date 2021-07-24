import { User } from "#models/User";

import { IQuery } from "../../IQuery";

export class UserStatusQuery extends IQuery {
	user!: User;
}
