import { Authentication } from "#api/Authentication";
import { AuthenticationSwitch } from "#comps/AuthenticationSwitch";
import Auth from "#routes/AuthStack";
import Drawer from "#routes/MainDrawer";
import { navigationRef, navigationRefReady } from "#routes/RootNavigator";
import { addTheme, ReactNativeUIScaling, Theme, ThemeProvider, ThemeSet } from "@kurabu/theme";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as Linking from "expo-linking";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import React from "react";
import { AppState, AppStateStatus, Dimensions, LogBox, NativeEventSubscription, PixelRatio, ScaledSize } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { themes } from "./src/themes";

LogBox.ignoreLogs([/Require\scycles/]);

void preventAutoHideAsync()

type StateType = {
	fonts: boolean;
	appstate: AppStateStatus;
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
			this._handleUrl(url);
		}
	};

	private _handleUrl(url: string | null) {
		if (url != null) {
			if (url.includes("auth")) {
				const token = url.split("auth/")[1];
				if (token == undefined || token == "" || token == null) {
					throw new Error("No token after redirect to auth");
				}
				const auth = Authentication.GetInstance()
				auth.ReceivedRedirect(token);
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
				this.setState(x => ({ ...x, dimensions: { window, screen } }));
			}
		);

		if (this.state.fonts == true) {
			return (
				<NavigationContainer ref={navigationRef} onReady={navigationRefReady}>
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
							
							<AuthenticationSwitch authComp={(<Auth />)} loggedinComp={(<Drawer />)} />
						</ThemeProvider>
					</SafeAreaProvider>
				</NavigationContainer>
			);
		}
	}
}
