export class UnexpectedMachineExecutionError extends Error { 
	  constructor(eventType: string, executionName: string) {
		super(`${executionName} was called with unexpected event type ${eventType}`);
		this.name = "UnexpectedMachineExecutionError";
	}
}
