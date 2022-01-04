import { autoInjectable } from "tsyringe";

import { UserStatusQuery } from "./UserStatusQuery";
import { UserStatusQueryResult } from "./UserStatusQueryResult";
import {
	IQueryHandler,
	IQueryResultStatus,
} from "#queries/IQuery";
import { ensureTokensOnUser } from "#models/Tokens";

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
				success: IQueryResultStatus.success,
			};
		if (user.tokens && user.tokens.verifier)
			return {
				status: UserStatus.authing,
				success: IQueryResultStatus.success,
			};
		if (!user.tokens || !user.tokens.token)
			return {
				status: UserStatus.tokens,
				success: IQueryResultStatus.success,
			};

		return {
			status: UserStatus.done,
			success: IQueryResultStatus.success,
		};
	}
}
