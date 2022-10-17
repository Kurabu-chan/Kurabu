import { AuthMachineContext, AuthMachineEvents, secureStoreOptions } from "#api/authentication/authStateMachine";
import { setItemAsync } from "expo-secure-store";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";

export const storeToken = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = [
		"done.invoke.postLogin",
		"Receive redirect"
	] as const

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "loadToken");
	
	
	let token = "";

	if ("token" in event) {
		token = event.token;
	}

	if ("data" in event) {
		token = event.data;
	}

	if (token === "") throw new Error("No token provided to storeToken");

	void (async () => {
		try {
			await setItemAsync("token", token, secureStoreOptions);
		} catch (_) {
			throw new Error("Failed to store token");
		}
	})();

	return context;
})



