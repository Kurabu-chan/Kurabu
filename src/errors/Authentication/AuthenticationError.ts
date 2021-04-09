import GeneralError from "../GeneralError";

export default class AuthenticationError extends GeneralError {
	constructor(message: any) {
		super(message);
		this.errorCode = "020";
		this.httpCode = 403;
		this.name = "AuthenticationError";
	}
}
