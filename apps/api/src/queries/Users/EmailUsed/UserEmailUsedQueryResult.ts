import { IQueryResult } from "#queries/IQuery";

export class UserEmailUsedQueryResult extends IQueryResult {
	emailIsUsed!: boolean;
}
