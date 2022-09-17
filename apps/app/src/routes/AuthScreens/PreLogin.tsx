import React, { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Kurabu from "../../../assets/pinklogin.svg";
import Auth from "#api/Authenticate";
import * as RootNavigator from "../RootNavigator";
import { Colors } from "#config/Colors";
import { RootSwitchContext } from "../../contexts/rootSwitch";
import { AuthBackground } from "#comps/AuthBackgrounds";

//uncomment to reset saved token and go into developer mode for the Auth system
// Auth.devMode = true;
// void Auth.ClearAsync();

export default function PreLogin() { 
	const rootSwitchContext = useContext(RootSwitchContext);

	useEffect(() => { 
		Auth.getInstance().then((auth) => {
			if (auth.getLoaded()) {
				rootSwitchContext("Drawer");
			} else {
				RootNavigator.navigate("Login", undefined);
			}
		}).catch((reason: unknown) => {
			throw reason;
		});
	})


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
