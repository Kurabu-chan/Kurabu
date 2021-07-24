import { ensureTokensOnUser } from "#models/Tokens";
import { autoInjectable } from "tsyringe";

import {
	IQueryHandler,
	IQueryResultStatus,
} from "../../IQuery";
import { UserStatusQuery } from "./UserStatusQuery";
import { UserStatusQueryResult } from "./UserStatusQueryResult";

export enum UserStatus {
	done,
	verif,
	authing,
	tokens,
}

@autoInjectable()
export class UserStatusQueryHandler
	implements IQueryHandler<UserStatusQuery, UserStatusQueryResult> {
	async handle({ user }: UserStatusQuery): Promise<UserStatusQueryResult> {
		user = await ensureTokensOnUser(user);

		if (user.verifCode)
			return {
				status: UserStatus.verif,
				success: IQueryResultStatus.SUCCESS,
			};
		if (user.tokens && user.tokens.verifier)
			return {
				status: UserStatus.authing,
				success: IQueryResultStatus.SUCCESS,
			};
		if (!user.tokens || !user.tokens.token)
			return {
				status: UserStatus.tokens,
				success: IQueryResultStatus.SUCCESS,
			};

		return {
			status: UserStatus.done,
			success: IQueryResultStatus.SUCCESS,
		};
	}
}
