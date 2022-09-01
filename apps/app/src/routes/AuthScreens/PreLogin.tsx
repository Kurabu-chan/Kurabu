import React, { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Kurabu from "../../../assets/pinklogin.svg";
import Auth from "#api/Authenticate";
import * as RootNavigator from "../RootNavigator";
import { Colors } from "#config/Colors";
import { RootSwitchContext } from "../../contexts/rootSwitch";

//uncomment to reset saved token and go into developer mode for the Auth system
// Auth.devMode = true;
// void Auth.ClearAsync();

export default function PreLogin() { 
	const rootSwitchContext = useContext(RootSwitchContext);

	useEffect(() => { 
		Auth.getInstance().then((auth) => {
			if (auth.getLoaded()) {
				console.log("switch")
				rootSwitchContext("Drawer");
			} else {
				RootNavigator.navigate("Login", undefined);
			}
		}).catch((reason: unknown) => {
			throw reason;
		});
	})
	console.log("switch2")


	return (
		<View
			style={styles.container}
		>
			<Kurabu
				height={Dimensions.get("window").height * 1.5}
				width={Dimensions.get("window").width * 3}
				preserveAspectRatio="xMinYMin slice"
				style={styles.image}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get("window").height,
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
    },
    image: {
        position: "absolute",
    }
});
