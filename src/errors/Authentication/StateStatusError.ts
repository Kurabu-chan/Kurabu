import AuthenticationError from "./AuthenticationError";

export default class StateStatusError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "024";
		this.httpCode = 403;
		this.name = "StateStatusError";
	}
}
