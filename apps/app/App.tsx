import "react-native-gesture-handler";
import * as Font from "expo-font";
import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import { AppState, AppStateStatus, Dimensions, LogBox, PixelRatio, ScaledSize, useWindowDimensions, NativeEventSubscription } from "react-native";
import Authentication from "#api/Authenticate";
import { NavigationContainer } from "@react-navigation/native";
import Drawer from "#routes/MainDrawer";
import Auth from "#routes/AuthStack";
import { DoSwitch, navigationRef, navigationRefReady } from "#routes/RootNavigator";
import { registerSwitchListener } from "#routes/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen"
import { defaultTheme, defaultThemeSet, ReactNativeUIScaling, ThemeProvider, addTheme, ThemeSet, Theme } from "@kurabu/theme";
import { themes } from "./src/themes";

LogBox.ignoreLogs([/Require\scycles/]);

void preventAutoHideAsync()

type StateType = {
    fonts: boolean;
    appstate: AppStateStatus;
    RootSwitch: "Auth" | "Drawer";
    dimensions: {
        screen: ScaledSize,
        window: ScaledSize,
    },
    themeSet: ThemeSet
};

export default class Application extends React.Component<never, StateType> {
    private _appStateChangeSubscription?: NativeEventSubscription;

    constructor(props: never) {
        super(props);
        registerSwitchListener(this.setRootSwitch.bind(this));

        const _themeSet: ThemeSet = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            default: {} as unknown as Theme
		};
		
		const themesEntries = Object.entries(themes);

		for (const theme of themesEntries) {
			addTheme(theme[0], theme[1], _themeSet);
		}

		const def = themesEntries[0][1];

        const themeSet = {
            ..._themeSet,
            default: def,
        }

        this.state = {
            fonts: false,
            appstate: AppState.currentState,
            RootSwitch: "Auth",
            dimensions: {
                window: Dimensions.get("window"),
                screen: Dimensions.get("screen"),
            },
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            themeSet: themeSet,
        };
    }

    async componentDidMount() {
        await this._checkInitialUrl();

        this._appStateChangeSubscription = AppState.addEventListener("change", this._handleAppStateChange.bind(this));
        Linking.addEventListener("url", (ss) => {
            void this._handleUrl(ss.url);
        });

		await this.getFonts();
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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto: require("./assets/fonts/Roboto_Regular.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Black_Italic: require("./assets/fonts/Roboto_Black_Italic.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Black: require("./assets/fonts/Roboto_Black.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Bold_Italic: require("./assets/fonts/Roboto_Bold_Italic.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Bold: require("./assets/fonts/Roboto_Bold.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Light_Italic: require("./assets/fonts/Roboto_Light_Italic.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Light: require("./assets/fonts/Roboto_Light.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Medium_Italic: require("./assets/fonts/Roboto_Medium_Italic.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Medium: require("./assets/fonts/Roboto_Medium.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Regular_Italic: require("./assets/fonts/Roboto_Regular_Italic.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Regular: require("./assets/fonts/Roboto_Regular.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Thin_Italic: require("./assets/fonts/Roboto_Thin_Italic.ttf"),
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			Roboto_Thin: require("./assets/fonts/Roboto_Thin.ttf"),
		});

        await hideAsync();

        this.setState((prevState) => ({
            ...prevState,
            fonts: true,
        }));
    }

    render() {
        Dimensions.addEventListener(
            "change",
            ({ window, screen }) => {
                this.setState(x => ({...x, dimensions: {window, screen}}));
            }
        );

        if (this.state.fonts == true) {
            return (
                <SafeAreaProvider>
                    <ThemeProvider scaling={new ReactNativeUIScaling((num: number) => { 
                        return PixelRatio.roundToNearestPixel(num);
                    })} customViewport={{
                        densityIndependentHeight: this.state.dimensions.window.height,
                        densityIndependentWidth: this.state.dimensions.window.width,
                        pixelHeight: this.state.dimensions.screen.height,
                        pixelWidth: this.state.dimensions.screen.height,
                        }}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    themeSet={this.state.themeSet}>
                        <NavigationContainer ref={navigationRef} onReady={navigationRefReady}>
                            {this.state.RootSwitch == "Auth" ? <Auth /> : <Drawer />}
                        </NavigationContainer>
                    </ThemeProvider>
                </SafeAreaProvider>
            );
        }
    }
}
