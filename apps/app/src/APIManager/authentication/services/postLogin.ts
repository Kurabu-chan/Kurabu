import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { Config } from "#config/Config";
import { IncorrectLoginError } from "#errors/auth/IncorrectLoginError";
import { ErrorManager } from "#errors/ErrorManager";
import { MissingFormParameterError } from "#errors/MissingFormParameterError";
import { UnexpectedKurabuError } from "#errors/UnexpectedKurabuError";
import { Configuration, JWTApi } from "@kurabu/api-sdk";
import { Response } from "node-fetch";
import { isEventAllowed } from "../isEventAllowed";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";

export const postLogin = async (context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = ["Submit login form"] as const

	

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		ErrorManager._throw(new UnexpectedMachineExecutionError(event.type, "postLogin"));

	if (!(event.email.trim() !== "" && event.password.trim() !== "")) {
		ErrorManager._throw(new MissingFormParameterError(["email", "password"], true));
	}

	const { email, password } = event;

	const appConfig = Config.GetInstance();
	const apiConfig = new Configuration({
		basePath: appConfig.GetApiRoot()
	});

	const api = new JWTApi(apiConfig);
	try {
		const res = await api.loginJWT({
			email: email.trim(),
			pass: password.trim()
		});

		return res.message;
	} catch (err: unknown) { 
		if (typeof err === "string") ErrorManager._throw(err);
		if (!(err instanceof Response)) ErrorManager._throw(err);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const json: unknown = await err.json();

		if (typeof json !== "object") ErrorManager._throw(json);
		if (json === null) return;
		if (!("code" in json) || typeof (json as { code: unknown }).code !== "string") ErrorManager._throw(json);


		switch ((json as {code: unknown}).code) {
			case "021": // incorrect login
				ErrorManager._throw(new IncorrectLoginError());
			case "028": // no tokens present
				ErrorManager._throw(new UnexpectedKurabuError(28));
			default:
				ErrorManager._throw(json);
		}
	}
}
