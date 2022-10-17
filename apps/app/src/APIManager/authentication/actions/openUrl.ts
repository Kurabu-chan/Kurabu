import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { Config } from "#config/Config";
import { AuthApi, Configuration } from "@kurabu/api-sdk";
import { Linking } from "react-native";
import { makeRedirect } from "../services/postVerify";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";

export const openUrl = (context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = [
		"done.invoke.postVerify",
		"done.invoke.getTokenStatus"
	] as const

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "loadToken");
	
	if (event.type === "done.invoke.postVerify") {
		void Linking.openURL(event.data);
		return context;
	}
	
	// call reauth and get a url
	void (async () => {
		if (!("registerToken" in context) || context.registerToken === undefined) {
			throw new Error("No registerToken stored while reauthing user");
		}

		const appConfig = Config.GetInstance();
		const apiConfig = new Configuration({
			basePath: appConfig.GetApiRoot(),
			accessToken: context.registerToken
		});

		const api = new AuthApi(apiConfig);
		const res = await api.reauthenticateUser({
			redirect: makeRedirect()
		});

		//is the response an error !?!?!?
		if (res.status === "error") {
			throw new Error(res.message);
		}

		if (res.message === undefined) throw new Error();

		void Linking.openURL(res.message);
	})();
}
