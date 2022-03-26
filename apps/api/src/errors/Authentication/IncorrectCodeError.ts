/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AuthenticationError from "./AuthenticationError";

export default class IncorrectCodeError extends AuthenticationError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "027";
        this.httpCode = 403;
        this.name = "IncorrectCodeError";
    }
}
