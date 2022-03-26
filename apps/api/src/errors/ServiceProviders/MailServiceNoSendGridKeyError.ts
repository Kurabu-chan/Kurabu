/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import GeneralError from "../GeneralError";

export default class MailServiceNoSendGridKeyError extends GeneralError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "031";
        this.httpCode = 500;
        this.name = "MailServiceNoSendGridKeyError";
    }
}
