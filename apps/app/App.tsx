import "react-native-gesture-handler";
import * as Font from "expo-font";
import React from "react";
import AppLoading from "expo-app-loading";
import * as Linking from "expo-linking";
import { AppState, AppStateStatus, LogBox } from "react-native";
import Authentication from "#api/Authenticate";
import { Config } from "#config/Config";
import { NavigationContainer } from "@react-navigation/native";
import Drawer from "#routes/MainDrawer";
import Auth from "#routes/AuthStack";
import { DoSwitch, navigationRef, navigationRefReady } from "#routes/RootNavigator";
import { registerSwitchListener } from "#routes/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

LogBox.ignoreLogs([/Require\scycles/]);

type StateType = {
    fonts: boolean;
    appstate: AppStateStatus;
    RootSwitch: "Auth" | "Drawer";
};

export default class Application extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        registerSwitchListener(this.setRootSwitch.bind(this));

        Config.GetInstance().then((config) => {
            console.log("Config loaded");
        });

        this.state = {
            fonts: false,
            appstate: AppState.currentState,
            RootSwitch: "Auth",
        };
    }

    componentDidMount() {
        this._checkInitialUrl();

        AppState.addEventListener("change", this._handleAppStateChange);
        Linking.addEventListener("url", async (ss) => {
            await this._handleUrl(ss.url);
        });
    }

    setRootSwitch(sw: "Auth" | "Drawer") {
        console.log(sw);
        this.setState((prevState) => ({
            ...prevState,
            RootSwitch: sw,
        }));
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    private _handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (this.state.appstate.match(/inactive|background/) && nextAppState === "active") {
            this._checkInitialUrl();
        }
        this.setState((prevState) => ({
            ...prevState,
            appstate: nextAppState,
        }));
    };
    private _checkInitialUrl = async () => {
        const url = await Linking.getInitialURL();
        if (url?.includes("auth")) {
            await this._handleUrl(url);
        }
    };

    private async _handleUrl(url: string | null) {
        if (url != null) {
            if (url.includes("auth")) {
                let token = url.split("auth/")[1];
                console.log(token);
                const auth = await Authentication.getInstance()
                    
                const currentToken = await auth.GetToken();

                if (currentToken == undefined || currentToken == "" || currentToken == null) {
                    throw new Error("No token after redirect to auth");   
                }

                try {
                    DoSwitch("Drawer");
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    render() {
        const setFontsLoaded = (yes: boolean) => {
            this.setState((prevState) => ({
                ...prevState,
                fonts: yes,
            }));
        };
        if (this.state.fonts == true) {
            return (
                <SafeAreaProvider>
                    <NavigationContainer ref={navigationRef} onReady={navigationRefReady}>
                        {this.state.RootSwitch == "Auth" ? <Auth /> : <Drawer />}
                    </NavigationContainer>
                </SafeAreaProvider>
            );
        } else {
            return (
                <AppLoading
                    startAsync={getFonts}
                    onFinish={() => {
                        setFontsLoaded(true);
                    }}
                    onError={console.warn}
                />
            );
        }
    }
}

const getFonts = async () => {
    await Font.loadAsync({
        AGRevueCyr: require("./assets/fonts/AGRevueCyr.ttf"),
    });
};
