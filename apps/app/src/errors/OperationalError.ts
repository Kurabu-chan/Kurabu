import { KurabuError } from "./KurabuError";

export class OperationalError extends KurabuError {
    constructor(_userMessage: string, _errorKind?: string){
		super(_userMessage, _userMessage, _errorKind ?? "OperationalError")
        this.isOperationalError = true;
    }
}
