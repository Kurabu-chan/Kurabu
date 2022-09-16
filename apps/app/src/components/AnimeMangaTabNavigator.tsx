import { createIconAnime, createIconManga } from "#helpers/DefaultIcons";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, applyUnfrozen, colors, ProvidedTheme, ThemedComponent } from "@kurabu/theme";
import { BottomTabNavigationEventMap, BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabNavigationConfig } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { DefaultNavigatorOptions, ParamListBase, TabNavigationState, TabRouterOptions, TypedNavigator } from "@react-navigation/core";
import React from "react";
import { createTypographyStyles } from "./themed/Typography";
import { StyleSheet } from "react-native"

type TabType = TypedNavigator<ParamListBase, TabNavigationState<ParamListBase>, BottomTabNavigationOptions, BottomTabNavigationEventMap, ({ initialRouteName, backBehavior, children, screenListeners, screenOptions, sceneContainerStyle, ...restWithDeprecated }: DefaultNavigatorOptions<ParamListBase, TabNavigationState<ParamListBase>, BottomTabNavigationOptions, BottomTabNavigationEventMap> & TabRouterOptions & BottomTabNavigationConfig) => JSX.Element>;

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	anime: React.ComponentType<any>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	manga: React.ComponentType<any>;
}

export class AnimeMangaTabNavigator extends ThemedComponent<Styles, Props>{
	private Tab!: TabType;

	constructor(props: Props) { 
		super(styles ,props);
		this.Tab = createBottomTabNavigator();
	}

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) {
		const color = applyUnfrozen({
			colors: {
				tabBarActiveBackgroundColor: colors.color("primary"),
				tabBarInactiveBackgroundColor: colors.color("secondary"),
			}
		}, providedTheme);


		const tabBarLabel = tabBarLabelStyle[1]({
			text: styles.tabBarLabelStyle
		}, providedTheme, {});

		return (
			<this.Tab.Navigator
				screenOptions={{
					tabBarActiveBackgroundColor: color.colors.tabBarActiveBackgroundColor,
					tabBarInactiveBackgroundColor: color.colors.tabBarInactiveBackgroundColor,
					tabBarLabelStyle: tabBarLabel,
					tabBarStyle: styles.tabBarStyle,
					headerShown: false,
				}}
			>
				<this.Tab.Screen
					name="Anime"
					component={this.props.anime}
					options={{
						tabBarIcon: (props: { focused: boolean, color: string, size: number }) => {
							return createIconAnime(props.size, {}, StyleSheet.flatten(styles.tabBarIconStyle).color)
						}
					}}
				></this.Tab.Screen>
				<this.Tab.Screen
					name="Manga"
					component={this.props.manga}
					options={{
						tabBarIcon: (props: { focused: boolean, color: string, size: number }) => {
							return createIconManga(props.size, {}, StyleSheet.flatten(styles.tabBarIconStyle).color)
						},
					}}
				></this.Tab.Screen>
			</this.Tab.Navigator>
		);
	}
}

const tabBarLabelStyle = createTypographyStyles("body2", "paragraph", false, "primary");

type Styles = typeof styles;

const styles = ThemedStyleSheet.create({
	tabBarLabelStyle: {
		...tabBarLabelStyle[0].text
	},
	tabBarStyle: {
		height: 55,
		display: "flex"
	},
	tabBarIconStyle: {
		color: colors.onColor("primary", "header")
	}
});
