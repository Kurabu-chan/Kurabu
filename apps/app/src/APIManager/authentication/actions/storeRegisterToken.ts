import { AuthMachineContext, AuthMachineEvents, secureStoreOptions } from "#api/authentication/authStateMachine";
import { setItemAsync } from "expo-secure-store";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";

export const storeRegisterToken = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = [
		"done.invoke.postRegister"
	] as const

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "loadToken");
	
	void (async () => {
		try {
			await setItemAsync("registerToken", event.data, secureStoreOptions);
		} catch (_) {
			throw new Error("Failed to store registerToken");
		}
	})();

	return context;
})
