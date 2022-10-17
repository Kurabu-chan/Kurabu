import { Authentication } from "#api/Authentication";
import { AuthBackground } from "#comps/AuthBackgrounds";
import PasswordStrength from "#comps/PasswordStrength";
import { Typography } from "#comps/themed/Typography";
import { ToolTip } from "#comps/ToolTip";
import { Colors } from "#config/Colors";
import { IncorrectEmailFormatError } from "#errors/auth/IncorrectEmailFormatError";
import { MailUsedError } from "#errors/auth/MailUsedError";
import { PasswordStrengthError } from "#errors/auth/PasswordStrengthError";
import { MissingFormParameterError } from "#errors/MissingFormParameterError";
import { ErrorBox } from "#errors/ui/ErrorBox";
import { AppliedStyles, colors, sizing, ThemedComponent } from "@kurabu/theme";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthStackParamList } from "../AuthStack";
import { AuthInput } from "./components/AuthInput";

type RegisterProps = {
	navigation: StackNavigationProp<AuthStackParamList, "Register">;
	route: RouteProp<AuthStackParamList, "Register">;
};

type RegisterState = {
	email: string;
	pass: string;
	retype: string;
	helpShown: false | "password" | "email";
};

class Register extends ThemedComponent<Styles, RegisterProps, RegisterState> {
	constructor(props: RegisterProps) {
		super(styles, props);
		this.state = {
			email: "",
			pass: "",
			retype: "",
			helpShown: false
		};
	}

	private changeEmail(newstr: string) {
		this.setState((prevState) => ({
			...prevState,
			email: newstr,
		}));
	}

	private changePass(newstr: string) {
		this.setState((prevState) => ({
			...prevState,
			pass: newstr,
		}));
	}

	private changeRetype(newstr: string) {
		this.setState((prevState) => ({
			...prevState,
			retype: newstr,
		}));
	}

	private DoSignup() {
		const authentication = Authentication.GetInstance();
		authentication.SubmitRegisterForm(this.state.email, this.state.pass, this.state.retype);
	}

	private DoSignin() {
		const authentication = Authentication.GetInstance();
		authentication.SignInButtonPressed();
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.appContainer}>
				<AuthBackground inverted={true} />
				<SafeAreaView style={styles.safeContainer} />
				<KeyboardAvoidingView
					behavior="padding"
					style={styles.content}>
					<ErrorBox errors={[
						{
							error: IncorrectEmailFormatError
						},
						{
							error: PasswordStrengthError
						},
						{
							error: MailUsedError
						},
						{
							error: MissingFormParameterError
						}
					]} />
					<ToolTip
						text={`When registering don't use your MyAnimeList credentials, we will link your account later.`}
						title="Register help"
						enabled={this.state.helpShown == "email"}
						style={styles.tooltip}
						tooltipContainerStyle={styles.tooltipContainerStyle}
						tooltipTitleProps={{
							colorVariant: "secondary",
							isOnContainer: false,
							textKind: "paragraph",
							variant: "headline4"
						}}
						tooltipTextProps={{
							colorVariant: "secondary",
							isOnContainer: false,
							textKind: "paragraph",
							variant: "body1"
						}}
					>
						<AuthInput
							autoComplete="email"
							placeholder="Email"
							onChangeText={this.changeEmail.bind(this)}
							value={this.state.email}
							secureTextEntry={false}
							containerStyle={styles.InputContainer}
							rightIcon={{
								name: "help",
								type: "material",
								onClick: () => this.setState({ helpShown: this.state.helpShown == "email" ? false : "email" })
							}}
						/>
					</ToolTip>

					<ToolTip
						text={`Password requirements:
- At least 8 characters (12+ recommended)
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character`}
						title="Register help"
						enabled={this.state.helpShown == "password"}
						style={styles.tooltip}
						tooltipContainerStyle={styles.tooltipContainerStyle}
						tooltipTitleProps={{
							colorVariant: "secondary",
							isOnContainer: false,
							textKind: "paragraph",
							variant: "headline4"
						}}
						tooltipTextProps={{
							colorVariant: "secondary",
							isOnContainer: false,
							textKind: "paragraph",
							variant: "body1"
						}}
					>
						<AuthInput
							autoComplete="password"
							placeholder="Password"
							onChangeText={this.changePass.bind(this)}
							value={this.state.pass}
							secureTextEntry={true}
							containerStyle={styles.InputContainer}
							rightIcon={{
								name: "help",
								type: "material",
								onClick: () => this.setState({ helpShown: this.state.helpShown == "password" ? false : "password" })
							}}
						/>
					</ToolTip>

					<PasswordStrength pass={this.state.pass} />
					<AuthInput
						autoComplete="password"
						placeholder="Retype password"
						onChangeText={this.changeRetype.bind(this)}
						value={this.state.retype}
						secureTextEntry={true}
						containerStyle={styles.InputContainer}
					/>

					<TouchableOpacity
						style={styles.SignupButton}
						activeOpacity={0.6}
						onPress={() => {
							void this.DoSignup();
						}}
					>
						<Typography variant="button" colorVariant="background" isOnContainer={false} textKind="paragraph">Sign up</Typography>
					</TouchableOpacity>
					<Typography colorVariant="background" isOnContainer={false} textKind="paragraph" variant="body1">
						No Account?
					</Typography>
					<TouchableOpacity
						style={styles.LoginButton}
						activeOpacity={0.6}
						onPress={() => {
							void this.DoSignin();
						}}
					>
						<Typography variant="button" colorVariant="background" isOnContainer={false} textKind="paragraph">Login</Typography>

					</TouchableOpacity>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

type Styles = typeof styles;
const styles = StyleSheet.create({
	appContainer: {
		// backgroundColor: Colors.BLUE
		height: sizing.vh(100),
		width: sizing.vw(100),
	},
	safeContainer: {
		// backgroundColor: Colors.BLUE
	},
	content: {
		alignItems: "center",
		justifyContent: "center",
		// backgroundColor: "red",
		position: "absolute",
		width: sizing.vw(100),
		bottom: "15%",
	},
	InputContainer: {
		width: 300,
		height: 54,
		marginTop: 16,
	},
	SignupButton: {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,
		backgroundColor: colors.color("tertiary"),
		width: 230,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 90,
		marginBottom: 40,
		color: Colors.TEXT,
	},
	LoginButton: {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,
		backgroundColor: colors.color("tertiary"),
		width: 200,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 5,
		color: Colors.TEXT,
	},
	tooltip: {

		// backgroundColor: "red"
	},
	tooltipContainerStyle: {
		width: sizing.vw(70),
		height: "auto",
		backgroundColor: colors.color("secondary"),
		padding: sizing.spacing("medium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,
	}
});

export default Register;
