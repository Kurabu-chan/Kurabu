import GeneralError from "../GeneralError";

export default class MailServiceNoSendGridKeyError extends GeneralError {
	constructor(message: any) {
		super(message);
		this.errorCode = "031";
		this.httpCode = 500;
		this.name = "MailServiceNoSendGridKeyError";
	}
}
