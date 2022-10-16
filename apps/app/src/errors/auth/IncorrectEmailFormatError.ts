import { OperationalError } from "../OperationalError";

export class IncorrectEmailFormatError extends OperationalError {
	constructor() {
		super("The email address you entered, is not an email address. Please enter an email address", "IncorrectEmailFormatError");
	}
}
