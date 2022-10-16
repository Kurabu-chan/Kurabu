import { Authentication } from "#api/Authentication";
import { AuthBackground } from "#comps/AuthBackgrounds";
import { Typography } from "#comps/themed/Typography";
import { ToolTip } from "#comps/ToolTip";
import { Colors } from "#config/Colors";
import { AppliedStyles, colors, sizing, ThemedComponent } from "@kurabu/theme";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { IncorrectLoginError } from "#errors/auth/IncorrectLoginError";
import { MissingFormParameterError } from "#errors/MissingFormParameterError";
import { ErrorBox } from "#errors/ui/ErrorBox";
import { UnexpectedKurabuError } from "#errors/UnexpectedKurabuError";
import { AuthStackParamList } from "../AuthStack";
import { AuthInput } from "./components/AuthInput";
import { FocusSubscriber } from "#comps/FocusSubscriber";
import { KurabuError } from "#errors/KurabuError";

type Props = StackScreenProps<AuthStackParamList, "Login">;

type LoginState = {
	navigator: StackNavigationProp<AuthStackParamList, "Login">;
	email: string;
	pass: string;
	helpShown: boolean;
};

class Login extends ThemedComponent<Styles, Props, LoginState> {
	private errorBox = React.createRef<ErrorBox<KurabuError>>();

	constructor(props: Props) {
		super(styles, props);
		this.state = {
			navigator: props.navigation,
			email: "",
			pass: "",
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

	private DoLogin() {
		const authentication = Authentication.GetInstance()
		authentication.SubmitLoginForm(this.state.email, this.state.pass);
	}

	private DoSignup() {
		const authentication = Authentication.GetInstance()
		authentication.SignUpButtonPressed();
	}

	private _handleFocus() {
		console.log("focus")
		this.errorBox.current?.clear();
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.appContainer}>
				<FocusSubscriber
					onFocus={this._handleFocus.bind(this)}
				/>
				<AuthBackground inverted={false} />
				<SafeAreaView style={styles.safeContainer} />
				<KeyboardAvoidingView
					behavior="padding"
					style={styles.content}>
					<ErrorBox
						
						ref={this.errorBox}
						errors={[
							{
								error: IncorrectLoginError
							},
							{
								error: UnexpectedKurabuError
							},
							{
								error: MissingFormParameterError
							}
						]} 
						/>
					<ToolTip
						text={`When logging in don't use your MyAnimeList credentials, use the credentials you used to register on Kurabu. 
						
A forgot password system is coming soon.`}
						title="Login help"
						enabled={this.state.helpShown}
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
								onClick: () => this.setState({ helpShown: !this.state.helpShown })
							}}
						/>
					</ToolTip>
					<AuthInput
						autoComplete="password"
						placeholder="Password"
						onChangeText={this.changePass.bind(this)}
						value={this.state.pass}
						secureTextEntry={true}
						containerStyle={styles.InputContainer}
					/>
					<TouchableOpacity
						style={styles.LoginButton}
						activeOpacity={0.6}
						onPress={() => {
							void this.DoLogin();
						}}
					>
						<Typography variant="button" colorVariant="background" isOnContainer={false} textKind="paragraph">Login</Typography>
					</TouchableOpacity>
					<Typography colorVariant="background" isOnContainer={false} textKind="paragraph" variant="body1">
						No Account?
					</Typography>
					<TouchableOpacity
						style={styles.SignupButton}
						activeOpacity={0.6}
						onPress={this.DoSignup.bind(this)}
					>
						<Typography variant="button" colorVariant="background" isOnContainer={false} textKind="paragraph">Sign up</Typography>
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
		marginTop: sizing.spacing("large"),
	},
	LoginButton: {
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
	SignupButton: {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,
		backgroundColor: colors.color("tertiary"),
		width: 200,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		marginTop: sizing.spacing("small"),
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

export default Login;
