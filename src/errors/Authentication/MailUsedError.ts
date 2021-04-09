import AuthenticationError from "./AuthenticationError";

export default class MailUsedError extends AuthenticationError {
	constructor(message: any) {
		super(message);
		this.errorCode = "025";
		this.httpCode = 403;
		this.name = "MailUsedError";
	}
}
