import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, StyleSheet, View, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Auth from "#api/Authenticate";
import PasswordStrength from "#comps/PasswordStrength";
import { Colors } from "#config/Colors";
import { AuthStackParamList } from "../AuthStack";
import { AuthBackground } from "#comps/AuthBackgrounds";
import { AppliedStyles, colors, sizing, ThemedComponent } from "@kurabu/theme";
import { AuthInput } from "./components/AuthInput";
import { Typography } from "#comps/themed/Typography";

type RegisterProps = {
	navigation: StackNavigationProp<AuthStackParamList, "Register">;
	route: RouteProp<AuthStackParamList, "Register">;
};

type RegisterState = {
	email: string;
	pass: string;
	retype: string;
};

class Register extends ThemedComponent<Styles, RegisterProps, RegisterState> {
	constructor(props: RegisterProps) {
		super(styles, props);
		this.state = {
			email: "",
			pass: "",
			retype: "",
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

	private async DoSignup() {
		const auth = await Auth.getInstance();
		const registerRes = await auth.TryRegister(this.state.email, this.state.pass);
		if (registerRes[0] != false) {
			//we got the token for the verification
			auth.setToken(registerRes[1]);

			this.props.navigation.replace("Verify", {
				token: registerRes[1],
			});
			return;
		}

		Alert.alert("Register Failed", registerRes[1]);
	}

	private DoSignin() {
		this.props.navigation.goBack();
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		return (
			<View style={styles.appContainer}>
				<AuthBackground inverted={true} />
				<SafeAreaView style={styles.safeContainer} />
				<KeyboardAvoidingView
					behavior="padding"
					style={styles.content}>
					<AuthInput
						autoComplete="email"
						placeholder="Email"
						onChangeText={this.changeEmail.bind(this)}
						value={this.state.email}
						secureTextEntry={false}
						containerStyle={styles.InputContainer}
					/>
					<AuthInput
						autoComplete="password"
						placeholder="Password"
						onChangeText={this.changePass.bind(this)}
						value={this.state.pass}
						secureTextEntry={false}
						containerStyle={styles.InputContainer}
					/>
					<PasswordStrength pass={this.state.pass} />
					<AuthInput
						autoComplete="password"
						placeholder="Retype password"
						onChangeText={this.changeRetype.bind(this)}
						value={this.state.retype}
						secureTextEntry={false}
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
});

export default Register;
