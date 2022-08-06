import "react-native-gesture-handler";
import * as Font from "expo-font";
import React from "react";
import * as Linking from "expo-linking";
import { AppState, AppStateStatus, LogBox, NativeEventSubscription } from "react-native";
import Authentication from "#api/Authenticate";
import { NavigationContainer } from "@react-navigation/native";
import Drawer from "#routes/MainDrawer";
import Auth from "#routes/AuthStack";
import { DoSwitch, navigationRef, navigationRefReady } from "#routes/RootNavigator";
import { registerSwitchListener } from "#routes/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen"

LogBox.ignoreLogs([/Require\scycles/]);

void preventAutoHideAsync()

type StateType = {
    fonts: boolean;
    appstate: AppStateStatus;
    RootSwitch: "Auth" | "Drawer";
};

export default class Application extends React.Component<never, StateType> {
    private _appStateChangeSubscription?: NativeEventSubscription;

    constructor(props: never) {
        super(props);
        registerSwitchListener(this.setRootSwitch.bind(this));

        this.state = {
            fonts: false,
            appstate: AppState.currentState,
            RootSwitch: "Auth",
        };
    }

    async componentDidMount() {
        await this._checkInitialUrl();

        this._appStateChangeSubscription = AppState.addEventListener("change", this._handleAppStateChange.bind(this));
        Linking.addEventListener("url", (ss) => {
            void this._handleUrl(ss.url);
        });

        void this.getFonts();
    }

    setRootSwitch(sw: "Auth" | "Drawer") {
        console.log(sw);
        this.setState((prevState) => ({
            ...prevState,
            RootSwitch: sw,
        }));
    }

    componentWillUnmount() {
        this._appStateChangeSubscription?.remove();  
    }

    private _handleAppStateChange(nextAppState: AppStateStatus) {
        if (this.state.appstate.match(/inactive|background/) && nextAppState === "active") {
            void this._checkInitialUrl();
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
                const token = url.split("auth/")[1];
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

    private async getFonts() { 
        await Font.loadAsync({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            AGRevueCyr: require("./assets/fonts/AGRevueCyr.ttf"),
        });

        await hideAsync();

        this.setState((prevState) => ({
            ...prevState,
            fonts: true,
        }));
    }

    render() {
        if (this.state.fonts) {
            return (
                <SafeAreaProvider>
                    <NavigationContainer ref={navigationRef} onReady={navigationRefReady}>
                        {this.state.RootSwitch == "Auth" ? <Auth /> : <Drawer />}
                    </NavigationContainer>
                </SafeAreaProvider>
            );
        }
    }
}
