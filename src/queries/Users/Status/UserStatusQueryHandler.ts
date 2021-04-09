import { IQueryHandler, IQueryResultStatus } from "../../IQuery";
import { UserStatusQuery } from "./UserStatusQuery";
import { UserStatusQueryResult } from "./UserStatusQueryResult";
import { autoInjectable } from "tsyringe";
import { getStatus } from "../../../models/User";

@autoInjectable()
export class UserStatusQueryHandler
	implements IQueryHandler<UserStatusQuery, UserStatusQueryResult> {
	async handle(query: UserStatusQuery): Promise<UserStatusQueryResult> {
		return {
			status: await getStatus(query.user),
			success: IQueryResultStatus.SUCCESS,
		};
	}
}
