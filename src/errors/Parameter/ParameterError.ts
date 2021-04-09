import GeneralError from "../GeneralError";

export default class ParameterError extends GeneralError {
	constructor(message: any) {
		super(message);
		this.errorCode = "010";
		this.httpCode = 422;
		this.name = "ParameterError";
	}
}
