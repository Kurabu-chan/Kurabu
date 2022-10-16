import { isDevelopment } from "#helpers/Environment"
import { formatDeveloperMessage, formatStackOnly } from "./errorUtils"
import { KurabuError } from "./KurabuError"

type ErrorHandler<TError extends KurabuError> = (err: TError) => void

export class ErrorManager {
	private _errors: KurabuError[]

	constructor() {
		this._errors = []
		this.handlers = {}
		this.handlerList = {}
	}

	listUnseenErrors() {
		return this._errors.filter(x => !x.seen);
	}


	catch(err: unknown) {
		this.logError(err);
		if (err instanceof KurabuError) {
			this._errors.push(err);

			if (this.handlers[err.errorKind] !== undefined && this.handlers[err.errorKind].length > 0) {
				for (const handler of this.handlers[err.errorKind]) {
					this.handlerList[handler](err);
				}
			}
		}
	}

	private logError(err: unknown) {
		if (err instanceof KurabuError) {
			let message = "";
			if (isDevelopment()) {
				message = err.getDeveloperMessage();
			} else { 
				message = err.getSystemMessage();
			}
			console.warn("[Caught Kurabu Error] " + message);
		} else if (err instanceof Error) {
			let message = "";
			if (isDevelopment()) {
				const stack = formatStackOnly(err.stack);
				message = formatDeveloperMessage(undefined, err.message, stack);
			} else {
				message = err.message;
			}
			console.warn("[Caught Error] " + message);
		} else {
			console.warn(`[Caught Non-error]`, err);
		}
	}

	handlerList: Record<symbol, ErrorHandler<KurabuError>>;

	handlers: Record<string, symbol[]>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleError<TError extends KurabuError>(errorClass: new (...args: any[]) => TError, handler: ErrorHandler<TError>) {
		if (!this.handlers[errorClass.name]) {
			this.handlers[errorClass.name] = [];
		}

		const uuid = Symbol("something")

		this.handlers[errorClass.name].push(uuid);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
		this.handlerList[uuid] = handler as any;

		return uuid;
	}

	deleteHandler(errorClass: (typeof KurabuError), handler: symbol) {
		if (!(handler in this.handlerList)) {
			return false;
		}

		delete this.handlerList[handler];
		this.handlers[errorClass.name] = this.handlers[errorClass.name].splice(this.handlers[errorClass.name].indexOf(handler), 1);
		return true;
	}


	public static _throw(err: unknown): never {
		ErrorManager.instance.catch(err);
		throw err;
	}

	public static catch(err: unknown) {
		ErrorManager.instance.catch(err);
	}
	private static _instance: ErrorManager;
	public static get instance() {
		if (!ErrorManager._instance) {
			ErrorManager._instance = new ErrorManager();
		}

		return ErrorManager._instance;
	}
}
