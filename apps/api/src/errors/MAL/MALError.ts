/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import GeneralError from "../GeneralError";

export default class MALError extends GeneralError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "040";
        this.httpCode = 500;
        this.name = "MALError";
    }
}
