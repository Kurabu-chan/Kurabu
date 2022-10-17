import { Authentication } from "#api/Authentication";
import { AuthBackground } from "#comps/AuthBackgrounds";
import { Colors } from "#config/Colors";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, ThemedComponent } from "@kurabu/theme";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { CodeField, Cursor, RenderCellOptions } from "react-native-confirmation-code-field";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { VerifyIncorrectCodeError } from "#errors/auth/VerifyIncorrectCodeError";
import { VerifyMaxAttemptsError } from "#errors/auth/VerifyMaxAttemptsError";
import { ErrorManager } from "#errors/ErrorManager";
import { ErrorBox } from "#errors/ui/ErrorBox";
import { AuthStackParamList } from "../AuthStack";

type RegisterProps = {
	navigation: StackNavigationProp<AuthStackParamList, "Verify">;
	route: RouteProp<AuthStackParamList, "Verify">;
};

type State = {
	token: string;
	code: string;
	attempt: number;
	requestStarted: boolean;
};

export default class Verif extends ThemedComponent<Styles, RegisterProps, State> {
	constructor(props: RegisterProps) {
		super(styles, props);
		this.state = {
			token: props.route.params.token,
			code: "",
			attempt: 0,
			requestStarted: false
		};
	}

	Cancel() {
		const authentication = Authentication.GetInstance();
		authentication.VerifyCancelButtonPressed();
	}

	SetCode(code: string) {
		if (this.state.requestStarted === true) return;

		if (code.match(/.*\D.*/)) return;

		this.setState((prevState) => ({
			...prevState,
			code: code,
		}));

		if (code.length == 6) {
			const authentication = Authentication.GetInstance();
			authentication.VerifyEnteredCode(code);
			this.setState({ ...this.state, code: "", requestStarted: true })
		}
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		const CELL_COUNT = 6;

		return (
			<View>
				<AuthBackground inverted={false} />
				<SafeAreaView />
				<View style={styles.content}>
					{/* <Text style={styles.head}>Kurabu</Text> */}
					<Text style={styles.sentMailText}>
						We've sent you an email with a verification code, please enter it below.
					</Text>
					<ErrorBox errors={[{
						error: VerifyIncorrectCodeError,
						onError: () => { 
							if (this.state.attempt >= 2) {
								ErrorManager.catch(new VerifyMaxAttemptsError());
							}

							this.setState({
								attempt: this.state.attempt + 1,
								requestStarted: false,
							});
						}
					},
						{
							error: VerifyMaxAttemptsError,
							onError: () => {
								this.setState({
									...this.state,
								});

								setTimeout(() => {
									this.Cancel();
								}, 3000);
							}
						}]} />
					<CodeField
						value={this.state.code}
						onChangeText={(code: string) => {
							void this.SetCode(code);
						}}
						cellCount={CELL_COUNT}
						rootStyle={styles.codeFieldRoot}
						keyboardType="number-pad"
						textContentType="oneTimeCode"
						
						renderCell={(data: RenderCellOptions) => (
							<Text
								key={data.index}
								style={[styles.cell, data.isFocused && styles.focusCell]}
							>
								{data.symbol || (data.isFocused ? <Cursor /> : null)}
							</Text>
						)}
					/>
					<TouchableOpacity style={styles.cancel} onPress={() => {
						void this.Cancel();
					}}>
						<Text>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

type Styles = typeof styles;

const styles = ThemedStyleSheet.create({
	codeFieldRoot: { marginTop: 20 },
	cell: {
		width: 40,
		height: 40,
		lineHeight: 38,
		fontSize: 24,
		margin: 5,
		borderWidth: 2,
		borderColor: Colors.CYAN,
		textAlign: "center",
		color: Colors.CYAN,
	},
	focusCell: {
		borderColor: Colors.CYAN_SELECTED,
	},
	content: {
		height: Dimensions.get("window").height,
		alignItems: "center",
		justifyContent: "center",
	},
	sentMailText: {
		color: Colors.TEXT,
		width: Dimensions.get("window").width * 0.8,
		paddingRight: Dimensions.get("window").width * 0.3,
		fontSize: 16,
		fontFamily: "AGRevueCyr",
		paddingTop: 100,
	},
	cancel: {
		marginTop: 30,
		backgroundColor: Colors.CYAN,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 3,
		borderColor: Colors.CYAN_SELECTED,
		borderWidth: 1,
	},
});
