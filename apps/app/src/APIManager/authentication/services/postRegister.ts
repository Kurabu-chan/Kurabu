import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { Config } from "#config/Config";
import { Configuration, JWTApi } from "@kurabu/api-sdk"
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";
import { ErrorManager } from "#errors/ErrorManager";
import { IncorrectEmailFormatError } from "#errors/auth/IncorrectEmailFormatError";
import { PasswordStrengthError } from "#errors/auth/PasswordStrengthError";
import { MailUsedError } from "#errors/auth/MailUsedError";
import { MissingFormParameterError } from "#errors/MissingFormParameterError";

export const postRegister = async (context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = ["Submit register form"] as const

	console.info(event);
		
	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		ErrorManager._throw(new UnexpectedMachineExecutionError(event.type, "postRegister"));

	if (!(event.email.trim() !== "" && event.password.trim() !== "" && event.confirmPassword.trim() !== "")) {
		ErrorManager._throw(new MissingFormParameterError(["email", "password", "retyped password"], true));
	}

	const { email, password, confirmPassword } = event;

	if (password !== confirmPassword) {
		throw new Error("Password and retyped password are not the same");
	}

	const appConfig = Config.GetInstance();
	const apiConfig = new Configuration({
		basePath: appConfig.GetApiRoot()
	});

	const api = new JWTApi(apiConfig);
	try {
		const res = await api.registerUserJWT({
			email: email,
			pass: password
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

		switch ((json as { code: unknown }).code) {
			case "012": // incorrect login
				if ("message" in json && json.message == "Email incorrect format") { 
					ErrorManager._throw(new IncorrectEmailFormatError());
				}
			case "014": // no tokens present
				ErrorManager._throw(new PasswordStrengthError());
			case "025":
				ErrorManager._throw(new MailUsedError());
			default:
				ErrorManager._throw(json);
		}
	}
}
