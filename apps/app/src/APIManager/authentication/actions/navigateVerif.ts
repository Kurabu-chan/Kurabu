import { AuthMachineContext } from "#api/authentication/authStateMachine";

export const navigateVerif = (context: AuthMachineContext) => {
	if (!context.authNavigator) {
		throw new Error("No navigator in context during navigateVerif");
	}

	if (context.registerToken === undefined) {
		throw new Error("No tokens in context during navigateVerif");

	}
	context.authNavigator?.navigate("Verify", {
		token: context.registerToken,
	});
	return context;
}
