import { AuthMachineContext } from "#api/authentication/authStateMachine";

export const navigateRegister = (context: AuthMachineContext) => {
	if (!context.authNavigator) {
		throw new Error("No navigator in context during navigateRegister");
	}

	context.authNavigator?.navigate("Register");
	return context;
}
