import { Authentication } from "#api/Authentication";
import { AuthBackground } from "#comps/AuthBackgrounds";
import { Colors } from "#config/Colors";
import { AuthStackParamList } from "#routes/AuthStack";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

//uncomment to reset saved token and go into developer mode for the Auth system
// Auth.devMode = true;
// void Auth.ClearAsync();

export default function PreLogin(props: {
	navigation: StackNavigationProp<AuthStackParamList, "PreLogin">
}) {
	const authentication = Authentication.GetInstance()
	authentication.CreateMachine(props.navigation);

	return (
		<View
			style={styles.container}
		>
			<AuthBackground inverted={false} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get("window").height,
		backgroundColor: Colors.ALTERNATE_BACKGROUND,
	}
});
