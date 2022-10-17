import { KurabuError } from "./KurabuError";

export class ProgrammerError extends KurabuError {
	constructor(message: string) {
		super(message, "It seems our programmers messed up. Sorry for the inconvenience.", "ProgrammerError");
		this.isProgrammerError = true;
	}

}
