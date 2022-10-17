import { AuthMachineContext } from "#api/authentication/authStateMachine";
import { Config } from "#config/Config";
import { Configuration, AuthApi } from "@kurabu/api-sdk"

export const getTokenStatus = async (context: AuthMachineContext) => {
	let token = "";

	if ("token" in context && context.token !== undefined) {
		token = context.token;
	} else if ("registerToken" in context && context.registerToken !== undefined) {
		token = context.registerToken;
	} else {
		throw new Error("No token stored while checking token status");
	}

	const appConfig = Config.GetInstance();
	const apiConfig = new Configuration({
		basePath: appConfig.GetApiRoot(),
		accessToken: token
	});

	const api = new AuthApi(apiConfig);
	const res = await api.getStatusForUser();

	//is the response an error !?!?!?
	if (res.status === "error") {
		throw new Error(res.message);
	}

	if (res.message === undefined) {
		throw new Error("No status returned from get token status");
	}

	return res.message;
}
