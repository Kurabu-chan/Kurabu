export abstract class IWebRequest {

}

export abstract class IWebRequestResult {
    success!: IWebRequestResultStatus
}

export enum IWebRequestResultStatus {
    SUCCESS,
    FAILURE
}

export interface IWebRequestHandler<TWebRequest extends IWebRequest, TResult extends IWebRequestResult> {
    handle(query: TWebRequest): Promise<TResult>;
}