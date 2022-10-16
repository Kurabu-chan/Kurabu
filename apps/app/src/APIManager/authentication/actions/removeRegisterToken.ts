import { AuthMachineContext, AuthMachineEvents, secureStoreOptions } from "#api/authentication/authStateMachine";
import { deleteItemAsync } from "expo-secure-store";
import { assign, AssignAction } from "xstate";

export const removeRegisterToken: AssignAction<AuthMachineContext, AuthMachineEvents[keyof AuthMachineEvents]> = assign((context: AuthMachineContext) => {
	context.registerToken = undefined;

	void (async () => {
		try {
			await deleteItemAsync("registerToken", secureStoreOptions);
		} catch (_) {
			throw new Error("Failed to delete registerToken");
		}
	})();

	return context;
}) 
