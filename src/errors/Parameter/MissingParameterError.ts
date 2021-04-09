import ParameterError from "./ParameterError";

export default class MissingParameterError extends ParameterError {
	constructor(message: any) {
		super(message);
		this.errorCode = "011";
		this.httpCode = 422;
		this.name = "MissingParameterError";
	}
}
