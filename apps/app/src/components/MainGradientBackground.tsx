import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, applyUnfrozen, colors, ProvidedTheme, ThemedComponent } from "@kurabu/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";

type Props = React.PropsWithChildren<{
	noFlex: boolean;
}>;

export class MainGradientBackground extends ThemedComponent<Styles, Props>{ 
	constructor(props: Props) { 
		super(styles, props)
	}

	renderThemed(styles: AppliedStyles<Styles>, providedTheme: ProvidedTheme) { 
		const gradient = applyUnfrozen({
			gradient: {
				first: colors.gradientStart("primary"),
				second: colors.gradientSecond("primary"),
				third: colors.gradientSecond("background"), 
				fourth: colors.gradientStart("background"),
			}
		}, providedTheme);

		return (
			<LinearGradient
				// Background Linear Gradient
				colors={[
					gradient.gradient.first,
					gradient.gradient.second,
					gradient.gradient.third,
					gradient.gradient.fourth,
				]}
				style={StyleSheet.flatten([styles.gradient, {
					flex: 0
				}])}
			>
				{this.props.children}
			</LinearGradient>
		);
	}
}

type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
	gradient: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		flex: 1
	}
})
