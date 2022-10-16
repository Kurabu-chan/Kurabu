import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { LoginUserStatusEnum } from "@kurabu/api-sdk";
import { assign } from "xstate";
import { UnexpectedMachineExecutionError } from "../UnexpectedMachineExecutionError";
import { isEventAllowed } from "../isEventAllowed";

export const loadTokenStatus = assign((context: AuthMachineContext, event: AuthMachineEvents[keyof AuthMachineEvents]) => {
	const allowedEvents = [
		"done.invoke.getTokenStatus",
		"done.invoke.postLogin",
	] as const

	if (!isEventAllowed<AuthMachineEvents, typeof allowedEvents[number]>(event, allowedEvents))
		throw new UnexpectedMachineExecutionError(event.type, "loadTokenStatus");
	
	if (Object.values(LoginUserStatusEnum).includes(event.data as LoginUserStatusEnum)) {
		context.tokenStatus = event.data as LoginUserStatusEnum;

		let token = "";

		if ("token" in context && context.token !== undefined) {
			token = context.token;
		} else if ("registerToken" in context && context.registerToken !== undefined) {
			token = context.registerToken;
		} else {
			throw new Error("No token stored while loading token status");
		}

		switch (context.tokenStatus) {
			case LoginUserStatusEnum.Tokens:
			case LoginUserStatusEnum.Authing:
			case LoginUserStatusEnum.Verif:
				context.registerToken = token;
				context.token = undefined;
				break;
			case LoginUserStatusEnum.Done:
				context.registerToken = undefined;
				context.token = token;
				break;
		}

		return context;
	}

	throw new Error("Invalid token status");
})
