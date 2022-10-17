import { OperationalError } from "../OperationalError";

export class VerifyIncorrectCodeError extends OperationalError { 
	constructor() {
		super("You entered an incorrect verification code. Please try again.", "VerifyIncorrectCodeError");
	}
}
