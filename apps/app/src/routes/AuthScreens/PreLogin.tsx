import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Kurabu from "../../../assets/pinklogin.svg";
import Auth from "#api/Authenticate";
import * as RootNavigator from "../RootNavigator";
import { DoSwitch } from "../RootNavigator";
import { Colors } from "#config/Colors";

//uncomment to reset saved token and go into developer mode for the Auth system
//Auth.devMode = true;
//Auth.ClearAsync();

type Props = unknown;

class PreLogin extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        Auth.getInstance().then((auth) => {
            if (auth.getLoaded()) {
                DoSwitch("Drawer");
            } else {
                RootNavigator.navigate("Login", undefined);
            }
        }).catch((reason: unknown) => {
            console.error(reason);
        });
    }

    render() {
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
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        height: Dimensions.get("window").height,
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
    },
    image: {
        position: "absolute",
    }
});

export default PreLogin;
