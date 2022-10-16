import { AuthMachineContext } from "#api/authentication/authStateMachine";

export const navigateLogin = (context: AuthMachineContext) => {
	if (!context.authNavigator) {
		throw new Error("No navigator in context during navigateLogin");
	}

	context.authNavigator?.navigate("Login");
	return context;
}
