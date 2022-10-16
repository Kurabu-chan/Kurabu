import { OperationalError } from "./OperationalError";

export class MissingFormParameterError extends OperationalError {
	constructor(parameters: string[], isOr = true) {
		super("Missing " + formatParameters(parameters, isOr), "MissingFormParameterError");
	}
}

function formatParameters(parameters: string[], isOr = true) { 
	return parameters.slice(0, parameters.length - 1).join(", ") + (isOr ? " or " : " and ") + parameters[parameters.length - 1];
}
