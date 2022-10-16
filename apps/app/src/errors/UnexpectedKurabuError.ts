import { OperationalError } from "./OperationalError";

export class UnexpectedKurabuError extends OperationalError {
	constructor(errorCode: number) {
		super("An unexpected error occurred, please contact an administrator (this can be done at https://discord.gg/dSvnuSE7Jg), and give them the following error code: " + errorCode.toString(), "UnexpectedKurabuError");
	}
}
