import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";

export const loadNavigator = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	if (event.type !== "Create machine") throw new UnexpectedMachineExecutionError(event.type, "loadNavigator");
	
	context.authNavigator = event.navigator;
	return context;
})
