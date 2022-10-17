import { AuthMachineContext, AuthMachineEvents } from "#api/authentication/authStateMachine";
import { LoginUserStatusEnum } from "@kurabu/api-sdk";
import { assign, AssignAction } from "xstate";

export const loadTokenStatusDone: AssignAction<AuthMachineContext, AuthMachineEvents[keyof AuthMachineEvents]> = assign((context: AuthMachineContext) => {
	context.tokenStatus = LoginUserStatusEnum.Done;
	return context;
})
