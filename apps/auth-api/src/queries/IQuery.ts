export interface IQueryHandler<TQuery extends IQuery, TResult extends IQueryResult> {
    handle(query: TQuery): Promise<TResult>;
}

export interface IQuery {

}

export interface IQueryResult {
    success: boolean
}
