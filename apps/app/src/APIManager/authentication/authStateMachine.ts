import { AuthStackParamList } from "#routes/AuthStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { createMachine } from "xstate";
import { LoginUserStatusEnum } from "@kurabu/api-sdk"
import { SecureStoreOptions, WHEN_UNLOCKED_THIS_DEVICE_ONLY } from "expo-secure-store";
import { loadNavigator } from "./actions/loadNavigator";
import { loadTokenStatus } from "./actions/loadTokenStatus";
import { removeRegisterToken } from "./actions/removeRegisterToken";
import { loadRegisterToken } from "./actions/loadRegisterToken";
import { storeRegisterToken } from "./actions/storeRegisterToken";
import { storeToken } from "./actions/storeToken";
import { loadToken } from "./actions/loadToken";
import { loadTokenFromStore } from "./actions/loadTokenFromStore";
import { navigateRegister } from "./actions/navigateRegister";
import { navigateLogin } from "./actions/navigateLogin";
import { navigateAuthing } from "./actions/navigateAuthing";
import { navigateVerif } from "./actions/navigateVerif";
import { checkTokenStore } from "./services/checkTokenStore";
import { getTokenStatus } from "./services/getTokenStatus";
import { postRegister } from "./services/postRegister";
import { postLogin } from "./services/postLogin";
import { postCancelRegister } from "./services/postCancelRegister";
import { loadTokenStatusDone } from "./actions/loadTokenStatusDone";
import { postVerify } from "./services/postVerify";
import { openUrl } from "./actions/openUrl";

type NavigatorType = StackNavigationProp<AuthStackParamList, keyof AuthStackParamList>;

export type AuthMachineContext = {
	authNavigator?: NavigatorType,
	registerToken?: string,
	token?: string,
	tokenStatus?: LoginUserStatusEnum
}

export type AuthMachineEvents =
	InvokationEventDone<"checkTokenStore", {
		token: string,
	} | {
		registerToken: string
	}> &
	InvokationEventDone<"postVerify", string> &
	InvokationEventDone<"getTokenStatus", LoginUserStatusEnum> &
	InvokationEventDone<StringInvokationEvents, string> &
	InvokationEventError<StringInvokationEvents | "getTokenStatus"> &
	{
		[Property in StringEvents]: {
			type: Property;
		};
	} & {
		"Create machine": {
			type: "Create machine";
			navigator: StackNavigationProp<AuthStackParamList, keyof AuthStackParamList>;
		},
		"Receive redirect": {
			type: "Receive redirect",
			token: string
		},
		"Submit register form": {
			type: "Submit register form",
			email: string,
			password: string,
			confirmPassword: string
		},
		"Submit login form": {
			type: "Submit login form",
			email: string,
			password: string
		},
		"Enter code": {
			type: "Enter code",
			code: string
		}
	};



type StringInvokationEvents = |
	"postRegister" |
	"postVerify" |
	"postLogin" |
	"postCancelRegister"

type InvokationEventDone<TEventName extends string, TEventType> = {
	[Prop in `done.invoke.${TEventName}`]: {
		type: Prop,
		data: TEventType
	}
}

type InvokationEventError<TEventName extends string> = {
	[Prop in `done.platform.${TEventName}`]: {
		type: Prop,
		data: Error
	}
}

type StringEvents =
	| "Sign in button"
	| "Sign up button"
	| "Enter code"
	| "Cancel button"
	| "Receive redirect";

const defaultContext: AuthMachineContext = {
	authNavigator: undefined,
	registerToken: undefined,
	token: undefined,
	tokenStatus: undefined
};

// URL: https://stately.ai/registry/editor/8cddc6a5-ce2c-4bdc-b272-df7fdd3dead2
export const authMachine = createMachine<AuthMachineContext, AuthMachineEvents[keyof AuthMachineEvents]>(
	{
		id: "Authentication flow",
		initial: "PreLogin Opened",
		predictableActionArguments: true,
		context: defaultContext,
		states: {
			"Creation": {
				invoke: {
					src: "checkTokenStore",
					id: "checkTokenStore",
					onDone: [
						{
							actions: "loadTokenFromStore",
							target: "Token status check"
						}
					],
					onError: [
						{
							target: "Login page"
						}
					]
				}
			},
			"Register page": {
				entry: "navigateRegister",
				on: {
					"Sign in button": {
						target: "Login page"
					},
					"Submit register form": {
						target: "Register"
					}
				}
			},
			"Login page": {
				entry: "navigateLogin",
				on: {
					"Sign up button": {
						target: "Register page"
					},
					"Submit login form": {
						target: "Login"
					}
				}
			},
			"Verify page": {
				entry: "navigateVerif",
				on: {
					"Enter code": {
						target: "Verify"
					},
					"Cancel button": {
						target: "Cancel"
					}
				}
			},
			"Register": {
				invoke: {
					src: "postRegister",
					id: "postRegister",
					onDone: [
						{
							actions: [
								"storeRegisterToken",
								"loadRegisterToken"
							],
							target: "Verify page"
						}
					],
					onError: [
						{
							target: "Register page"
						}
					]
				}
			},
			"Verify": {
				invoke: {
					src: "postVerify",
					id: "postVerify",
					onDone: [
						{
							target: "open URL"
						}
					],
					onError: [
						{
							target: "Verify page"
						}
					]
				}
			},
			"open URL": {
				entry: [
					"navigateAuthing",
					"openUrl"
				],
				on: {
					"Receive redirect": {
						actions: [
							"storeToken",
							"removeRegisterToken",
							"loadToken",
							"loadTokenStatusDone"
						],
						target: "Loggedin"
					}
				}
			},
			"Loggedin": {
				type: "final"
			},
			"Login": {
				invoke: {
					src: "postLogin",
					id: "postLogin",
					onDone: [
						{
							actions: [
								"loadToken",
								"storeToken",
								"loadTokenStatusDone"
							],
							target: "Loggedin"
						}
					],
					onError: [
						{
							target: "Login page"
						}
					]
				}
			},
			"Cancel": {
				invoke: {
					src: "postCancelRegister",
					id: "postCancelRegister",
					onDone: [
						{
							actions: "removeRegisterToken",
							target: "Register page"
						}
					],
					onError: [
						{
							target: "Verify page"
						}
					]
				}
			},
			"Token status check": {
				invoke: {
					src: "getTokenStatus",
					id: "getTokenStatus",
					onDone: [
						{
							actions: "loadTokenStatus",
							cond: (_, event) => {
								return event.data === "done";
							},
							target: "Loggedin"
						},
						{
							actions: "loadTokenStatus",
							cond: (_, event) => {
								return event.data === "verif";
							},
							target: "Verify page"
						},
						{
							actions: "loadTokenStatus",
							cond: (_, event) => {
								return event.data === "authing";
							},
							target: "open URL"
						},
						{
							actions: "loadTokenStatus",
							cond: (_, event) => {
								return event.data === "tokens";
							},
							target: "open URL"
						}
					],
					onError: [
						{
							target: "Login page"
						}
					]
				}
			},
			"PreLogin Opened": {
				on: {
					"Create machine": {
						actions: "loadNavigator",
						target: "Creation"
					}
				}
			}
		}
	},
	{
		actions: {
			loadNavigator,
			removeRegisterToken,
			loadTokenStatus,
			loadRegisterToken,
			storeRegisterToken,
			storeToken,
			loadToken,
			loadTokenFromStore,
			navigateRegister,
			navigateLogin,
			navigateAuthing,
			navigateVerif,
			loadTokenStatusDone,
			openUrl
		},
		services: {
			checkTokenStore,
			getTokenStatus,
			postRegister,
			postLogin,
			postCancelRegister,
			postVerify
		}
	}
);

export const secureStoreOptions: SecureStoreOptions = {
	keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};
