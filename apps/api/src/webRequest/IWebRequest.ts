/* eslint-disable max-classes-per-file */
export abstract class IWebRequest {}

export abstract class IWebRequestResult {
    success!: IWebRequestResultStatus;
}

export enum IWebRequestResultStatus {
    success,
    failure,
}

export interface IWebRequestHandler<
    TWebRequest extends IWebRequest,
    TResult extends IWebRequestResult
> {
    handle(query: TWebRequest): Promise<TResult>;
}
