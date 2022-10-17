import { OperationalError } from "../OperationalError";

export class VerifyMaxAttemptsError extends OperationalError {
	constructor() {
		super("You've reached the maximum attempts for verifying your email. Registration will be canceled in three seconds.", "VerifyMaxAttemptsError");
	}
}
