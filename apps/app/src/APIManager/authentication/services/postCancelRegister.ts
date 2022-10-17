import { AuthMachineContext } from "#api/authentication/authStateMachine";
import { Config } from "#config/Config";
import { Configuration, JWTApi } from "@kurabu/api-sdk"

export const postCancelRegister = async (context: AuthMachineContext) => {
	if (!("registerToken" in context) || context.registerToken === undefined) {
		throw new Error("No registerToken stored whilecanceling registration");
	}

	const appConfig = Config.GetInstance();
	const apiConfig = new Configuration({
		basePath: appConfig.GetApiRoot(),
		accessToken: context.registerToken
	});

	const api = new JWTApi(apiConfig);
	const res = await api.cancelRegistrationForUserJWT();

	//is the response an error !?!?!?
	if (res.status === "error") {
		throw new Error(res.message);
	}
}
