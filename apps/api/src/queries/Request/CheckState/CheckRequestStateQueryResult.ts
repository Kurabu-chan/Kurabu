import { User } from "#models/User";

import { IQueryResult } from "#queries/IQuery";

export class CheckRequestStateQueryResult extends IQueryResult {
    state!: string;
	user!: User;
	isJwt!: boolean;
}
