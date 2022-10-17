import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";

export const loadRegisterToken = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	if (event.type !== "done.invoke.postRegister") throw new UnexpectedMachineExecutionError(event.type, "loadRegisterToken");

	context.registerToken = event.data;
	return context;
})
