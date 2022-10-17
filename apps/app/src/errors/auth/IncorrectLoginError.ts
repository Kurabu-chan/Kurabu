import { OperationalError } from "../OperationalError";

export class IncorrectLoginError extends OperationalError {
	constructor() {
		super("You used incorrect login credentials. Please try again with the correct credentials.", "IncorrectLoginError");
	}
}
