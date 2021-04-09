export abstract class IQuery {}

export abstract class IQueryResult {
	success!: IQueryResultStatus;
}

export enum IQueryResultStatus {
	SUCCESS,
	FAILURE,
}

export interface IQueryHandler<
	TQuery extends IQuery,
	TResult extends IQueryResult
> {
	handle(query: TQuery): Promise<TResult>;
}
