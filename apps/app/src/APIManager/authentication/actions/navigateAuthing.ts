import { AuthMachineContext } from "#api/authentication/authStateMachine";

export const navigateAuthing = (context: AuthMachineContext) => {
	if (!context.authNavigator) {
		throw new Error("No navigator in context during navigateAuthing");
	}

	// TODO: add authing page, with link to browser
	context.authNavigator?.navigate("PreLogin");
	return context;
}
