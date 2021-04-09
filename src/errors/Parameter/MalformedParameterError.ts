import ParameterError from "./ParameterError";

export default class MalformedParameterError extends ParameterError {
	constructor(message: any) {
		super(message);
		this.errorCode = "012";
		this.httpCode = 422;
		this.name = "MalformedParameterError";
	}
}
