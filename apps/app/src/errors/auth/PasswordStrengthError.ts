import { OperationalError } from "../OperationalError";

export class PasswordStrengthError extends OperationalError {
	constructor() {
		super("Your password is too weak. Press the help button to see the requirements.", "PasswordStrengthError");
	}
}
