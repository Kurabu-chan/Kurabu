import GeneralError from "../GeneralError";

export default class MALError extends GeneralError {
	constructor(message: any) {
		super(message);
		this.errorCode = "040";
		this.httpCode = 500;
		this.name = "MALError";
	}
}
