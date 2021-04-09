import { IQueryResult } from "../../IQuery";

export class UserEmailUsedQueryResult extends IQueryResult {
	emailIsUsed!: boolean;
}
