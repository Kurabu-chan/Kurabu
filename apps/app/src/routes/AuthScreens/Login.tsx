import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, StyleSheet, View, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Auth from "#api/Authenticate";
import { Colors } from "#config/Colors";
import { AuthStackParamList } from "../AuthStack";
import { RootSwitchContext } from "../../contexts/rootSwitch";
import { AuthBackground } from "#comps/AuthBackgrounds";
import { AppliedStyles, ThemedComponent, colors, sizing } from "@kurabu/theme";
import { AuthInput } from "./components/AuthInput";
import { Typography } from "#comps/themed/Typography";
import { ToolTip } from "#comps/ToolTip";

type Props = StackScreenProps<AuthStackParamList, "Login">;

type LoginState = {
	navigator: StackNavigationProp<AuthStackParamList, "Login">;
	email: string;
	pass: string;
	helpShown: boolean;
};

class Login extends ThemedComponent<Styles, Props, LoginState> {
	static contextType = RootSwitchContext

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

	private async DoLogin(rootSwitch: (a: "Auth" | "Drawer") => void) {
		const auth = await Auth.getInstance()

		const loginRes = await auth.Trylogin(this.state.email, this.state.pass)
		if (loginRes[0] === true) {
			rootSwitch("Drawer");
			return;
		}

		Alert.alert("Login Failed", loginRes[1]);
	}

	private DoSignup() {
		this.state.navigator.navigate("Register");
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		const rootSwitchContext = this.context as (a: "Auth" | "Drawer") => void;

		return (
			<View style={styles.appContainer}>
				<AuthBackground inverted={false} />
				<SafeAreaView style={styles.safeContainer} />
				<KeyboardAvoidingView
					behavior="padding"
					style={styles.content}>
					<ToolTip
						text="When logging in don't use your MyAnimeList credentials, use the credentials you used to register on Kurabu."
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
							onFocus={() => this.setState({ helpShown: true })}
							onLostFocus={() => this.setState({ helpShown: false })}
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
							void this.DoLogin(rootSwitchContext);
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
