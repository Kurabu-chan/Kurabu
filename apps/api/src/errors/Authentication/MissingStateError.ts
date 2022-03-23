/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AuthenticationError from "./AuthenticationError";

export default class MissingStateError extends AuthenticationError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "023";
        this.httpCode = 403;
        this.name = "MissingStateError";
    }
}
