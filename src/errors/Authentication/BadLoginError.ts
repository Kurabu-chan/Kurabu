import AuthenticationError from "./AuthenticationError";

export default class BadLoginError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "021";
		this.httpCode = 403;
		this.name = "BadLoginError";
	}
}
