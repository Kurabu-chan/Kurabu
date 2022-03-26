/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ParameterError from "./ParameterError";

export default class PasswordStrengthError extends ParameterError {
    constructor(message?: string) {
        super(message);
        this.errorCode = "014";
        this.httpCode = 422;
        this.name = "PasswordStrengthError";
    }
}
