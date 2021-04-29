import React from "react";
import { Text, View } from "react-native";
import { Dimensions } from "react-native";
import { SetRootSwitch } from "../../../App";
import Auth from "../../APIManager/Authenticate";
import * as RootNavigator from "../RootNavigator";

//uncomment to reset saved uuid and go into developer mode for the Auth system
Auth.devMode = true;
Auth.ClearAsync();

class PreLogin extends React.Component {
    constructor(props: any) {
        super(props);

        //this.state.navigation.navigate("Details");
        console.log("prelogin");
        Auth.getInstance().then((auth) => {
            console.log("auth done");
            if (auth.getLoaded()) {
                console.log("auth done drawer");
                SetRootSwitch("Drawer");
            } else {
                RootNavigator.navigate("Login", undefined);
            }
        });
    }

    render() {
        return (
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: Dimensions.get("window").height,
                }}>
                <Text>Loading</Text>
            </View>
        );
    }
}

export default PreLogin;
