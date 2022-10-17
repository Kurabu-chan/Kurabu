import { AuthStackParamList } from "#routes/AuthStack";
import { StackNavigationProp } from "@react-navigation/stack";
import { deleteItemAsync } from "expo-secure-store";
import { interpret, InterpreterFrom } from "xstate"
import { authMachine, secureStoreOptions } from "./authentication/authStateMachine";

type StateChangeCallback = (currState: string, prevState: string) => void

export class Authentication {
	private _authService: InterpreterFrom<typeof authMachine>;

	private constructor() {
		this._authService = interpret(authMachine);
		this.handleStateChanges();
		this._authService.start();
	}

	public listenForChanges(callback: StateChangeCallback) {
		this.changeListeners.push(callback);
	}

	private changeListeners: StateChangeCallback[] = [];

	private _prevState = "";
	private handleStateChanges() {
		this._authService.onTransition((state) => {
			const stateValue = state.value;
			if (this._prevState !== stateValue) {
				if (typeof stateValue !== "string") return;
				this.changeListeners.forEach((listener) => listener(stateValue, this._prevState));
				
				this._prevState = stateValue;
				console.log("[Auth] State changed to: ", stateValue);
			}
		})
	}

	get state(): string { 
		const s = this._authService.getSnapshot().value;

		if (typeof s !== "string") throw new Error("State wasn't a string");
		return s;
	}

	get token(): string {
		const t = this._authService.getSnapshot().context.token;
		if (!t) throw new Error("No token was found");

		return t;
	}

	
	
	CreateMachine(navigator: StackNavigationProp<AuthStackParamList, keyof AuthStackParamList>) {
		this._authService.send({ type: "Create machine", navigator });
	}

	SignInButtonPressed() {
		this._authService.send("Sign in button");
	}
	SignUpButtonPressed() {
		this._authService.send("Sign up button");

	}
	SubmitRegisterForm(email: string, password: string, confirmPassword: string) {
		this._authService.send({
			type: "Submit register form",
			email,
			password,
			confirmPassword
		});
	}
	SubmitLoginForm(email: string, password: string) {
		this._authService.send({
			type: "Submit login form",
			email,
			password
		});
	}
	VerifyCancelButtonPressed() {
		this._authService.send("Cancel button");
	}
	VerifyEnteredCode(code: string) {
		this._authService.send({
			type: "Enter code",
			code
		});
	}
	ReceivedRedirect(token: string) {
		this._authService.send({
			type: "Receive redirect",
			token
		});
	}
	static async ClearStorage() {
		await deleteItemAsync("token", secureStoreOptions).catch();
		await deleteItemAsync("registerToken", secureStoreOptions).catch();
	}

	private static _instance?: Authentication;
	public static GetInstance() {
		if (this._instance === undefined) {
			this._instance = new Authentication();
		}

		return this._instance;
	}
}
