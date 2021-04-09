import AuthenticationError from "./AuthenticationError";

export default class TokensNotPresentError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "028";
		this.httpCode = 403;
		this.name = "TokensNotPresentError";
	}
}
