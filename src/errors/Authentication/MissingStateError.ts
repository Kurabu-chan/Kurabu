import AuthenticationError from "./AuthenticationError";

export default class MissingStateError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "023";
		this.httpCode = 403;
		this.name = "MissingStateError";
	}
}
