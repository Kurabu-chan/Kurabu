import ParameterError from "./ParameterError";

export default class MistypedParameterError extends ParameterError {
	constructor(message: any) {
		super(message);
		this.errorCode = "013";
		this.httpCode = 422;
		this.name = "MistypedParameterError";
	}
}
