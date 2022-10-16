import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed"

export const loadTokenFromStore = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = ["done.invoke.checkTokenStore"] as const

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "loadTokenFromStore");
	
	if ("token" in event.data) {
		context.token = event.data.token;
	}

	if ("registerToken" in event.data) {
		context.registerToken = event.data.registerToken;
	}
	
	return context;
})
