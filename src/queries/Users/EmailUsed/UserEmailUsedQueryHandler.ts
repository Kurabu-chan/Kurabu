import { autoInjectable } from "tsyringe";

import { UserEmailUsedQuery } from "./UserEmailUsedQuery";
import { UserEmailUsedQueryResult } from "./UserEmailUsedQueryResult";
import {
	IQueryHandler,
	IQueryResultStatus,
} from "#queries/IQuery";
import { Database } from "#helpers/Database";

@autoInjectable()
export class UserEmailUsedQueryHandler
	implements IQueryHandler<UserEmailUsedQuery, UserEmailUsedQueryResult> {
	constructor(private database: Database) {}

	async handle(query: UserEmailUsedQuery): Promise<UserEmailUsedQueryResult> {
		const count = await this.database.models.user.count({
			where: { email: query.email },
		});

		return {
			emailIsUsed: count !== 0,
			success: IQueryResultStatus.success,
		};
	}
}
