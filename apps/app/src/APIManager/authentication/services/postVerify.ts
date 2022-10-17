import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { Config } from "#config/Config";
import { Configuration, JWTApi } from "@kurabu/api-sdk"
import * as Linking from "expo-linking";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";
import { Response } from "node-fetch";
import { ErrorManager } from "#errors/ErrorManager";
import { VerifyIncorrectCodeError } from "#errors/auth/VerifyIncorrectCodeError";
import { VerifyMaxAttemptsError } from "#errors/auth/VerifyMaxAttemptsError";

export const postVerify = async (context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = ["Enter code"] as const

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "postVerify");

	if (!(event.code.trim() !== "")) {
		throw new Error("Missing code");
	}

	if (!("registerToken" in context) || context.registerToken === undefined) {
		throw new Error("No registerToken stored while verifying code");
	}

	const { code } = event;

	const appConfig = Config.GetInstance();
	const apiConfig = new Configuration({
		basePath: appConfig.GetApiRoot(),
		accessToken: context.registerToken
	});

	const api = new JWTApi(apiConfig);
	try {
		const res = await api.verifyEmailAddressJWT({
			code: code.trim(),
			redirect: makeRedirect()
		});

		//is the response an error !?!?!?
		if (res.status === "error") {
			throw new Error(res.message);
		}
		
		return res.message;
	} catch (err) { 
		if (typeof err !== "object") {
			throw err;
			
		} else if (err !== null && "status" in err && (err as Record<"status", unknown>).status === 403) {
			const errResponse = (err as Response);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const errJson = await errResponse.json() as unknown;

			if (typeof errJson !== "object") throw err;
			if (errJson === null) throw err;
			if (!("code" in errJson)) throw err;
			if ((errJson as Record<"code", unknown>).code === "027") err = new VerifyIncorrectCodeError();
			else if ((errJson as Record<"code", unknown>).code === "026") err = new VerifyMaxAttemptsError();
			else if ((errJson as Record<"code", unknown>).code === "023") err = new VerifyMaxAttemptsError();
			else throw err;

			ErrorManager.catch(err);
			throw err;
		}

		if(err instanceof Error) {
			throw err;
		}
	}
}

export function makeRedirect(): string {
	const expoScheme = "kurabu://";
	// Technically you need to pass the correct redirectUrl to the web browser.
	let redir = Linking.makeUrl();
	if (redir.startsWith("exp://1")) {
		// handle simulator(localhost) and device(Lan)
		redir = redir + "/--/";
	} else if (redir === expoScheme) {
		// dont do anything
	} else {
		// handle the expo client
		redir = redir + "/";
	}

	return redir + "auth/";
}
