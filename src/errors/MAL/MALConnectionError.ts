import MALError from "./MALError";

export default class MALConnectionError extends MALError {
	constructor(message: any) {
		super(message);
		this.errorCode = "041";
		this.httpCode = 500;
		this.name = "MALConnectionError";
	}
}
