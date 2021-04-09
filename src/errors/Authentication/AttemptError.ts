import AuthenticationError from "./AuthenticationError";

export default class AttemptError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "026";
		this.httpCode = 403;
		this.name = "AttemptError";
	}
}
