import AuthenticationError from "./AuthenticationError";

export default class RefreshError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "022";
		this.httpCode = 403;
		this.name = "RefreshError";
	}
}
