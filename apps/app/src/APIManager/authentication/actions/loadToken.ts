import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";

export const loadToken = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = ["Receive redirect", "done.invoke.postLogin"] as const
	
	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "loadToken");

	if ("data" in event) {
		context.token = event.data		
	}

	if ("token" in event) {
		context.token = event.token
	}

	return context;
})
