/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default class GeneralError extends Error {
	protected errorCode = "000";
	protected httpCode = 500;

	constructor(message: any) {
		super(message);
		this.name = "GeneralError";
	}

	public getErrorCode() {
		return this.errorCode;
	}

	public getHttpCode() {
		return this.httpCode;
	}
}
