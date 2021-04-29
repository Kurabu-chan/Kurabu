import React from "react";
import { Text, View } from "react-native";
import { Dimensions } from "react-native";
import { DoSwitch } from "../RootNavigator";
import Auth from "../../APIManager/Authenticate";
import * as RootNavigator from "../RootNavigator";

//uncomment to reset saved uuid and go into developer mode for the Auth system
//Auth.devMode = true;
//Auth.ClearAsync();

class PreLogin extends React.Component<any> {
    constructor(props: any) {
        super(props);

        Auth.getInstance().then((auth) => {
            if (auth.getLoaded()) {
                DoSwitch("Drawer");
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
