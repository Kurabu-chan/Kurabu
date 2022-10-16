import { OperationalError } from "../OperationalError";

export class MailUsedError extends OperationalError {
	constructor() {
		super("The email address you entered is already in use. Please either login, or use a different email address.", "MailUsedError");
	}
}
