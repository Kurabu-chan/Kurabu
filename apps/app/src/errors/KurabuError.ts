import { formatDeveloperMessage, formatStackOnly } from "./errorUtils";

export class KurabuError extends Error {
    constructor(private _message: string, private _userMessage: string, private _errorKind: string = "KurabuError"){
		super(_message);
		
		this.stack = formatStackOnly(this.stack);
        this.message = formatDeveloperMessage(this._errorKind, this._message, this.stack);
    }

    private _seen = false;
    public get seen(): boolean{
        return this._seen;
    }
    public markSeen(){
        this._seen = true;
    }
    public get errorKind(){
        return this._errorKind;
    }
    
    getUserFriendlyMessage(): string {
        return this._userMessage;
    }

    getSystemMessage(): string {
        return `[${this._errorKind}] ${this._message}`;
    }

    getDeveloperMessage(): string {
        return this.message;
    }

    public isOperationalError = false;
    public isProgrammerError = false;
}
