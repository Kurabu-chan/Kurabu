/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ParameterError from "./ParameterError";

export default class MalformedParameterError extends ParameterError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "012";
        this.httpCode = 422;
        this.name = "MalformedParameterError";
    }
}
