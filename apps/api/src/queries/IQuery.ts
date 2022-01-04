/* eslint-disable max-classes-per-file */
export abstract class IQuery {}

export abstract class IQueryResult {
	success!: IQueryResultStatus;
}

export enum IQueryResultStatus {
	success,
	failure,
}

export interface IQueryHandler<
	TQuery extends IQuery,
	TResult extends IQueryResult
> {
	handle(query: TQuery): Promise<TResult>;
}
