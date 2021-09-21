import "react-native-gesture-handler";
import * as Font from "expo-font";
import React from "react";
import AppLoading from "expo-app-loading";
import * as Linking from "expo-linking";
import { AppState, AppStateStatus } from "react-native";
import Authentication from "./src/APIManager/Authenticate";
import { Config } from "./src/config/Config";
import { NavigationContainer } from "@react-navigation/native";
import Drawer from "./src/routes/MainDrawer";
import Auth from "./src/routes/AuthStack";
import {
    DoSwitch,
    navigationRef,
    navigationRefReady,
} from "./src/routes/RootNavigator";
import { registerSwitchListener } from "./src/routes/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
        Linking.addEventListener("url", (ss) => {
            this._handleUrl(ss.url);
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
        if (
            this.state.appstate.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
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
            this._handleUrl(url);
        }
    };

    private _handleUrl = (url: string | null) => {
        if (url != null) {
            if (url.includes("auth")) {
                let uuid = url.split("auth/")[1];
                console.log(uuid);
                Authentication.getInstance()
                    .then((auth) => {
                        auth.setCode(uuid);
                        try {
                            DoSwitch("Drawer");
                        } catch (e) {
                            console.log(e);
                        }
                    })
                    .catch((e) => { });
            }
        }
    };

    render() {
        const setFontsLoaded = (yes: boolean) => {
            this.setState((prevState) => ({ ...prevState, fonts: yes }));
        };
        if (this.state.fonts == true) {
            return (
                <SafeAreaProvider>
                    <NavigationContainer
                        ref={navigationRef}
                        onReady={navigationRefReady}>
                        {this.state.RootSwitch == "Auth" ? (
                            <Auth />
                        ) : (
                            <Drawer />
                        )}
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
