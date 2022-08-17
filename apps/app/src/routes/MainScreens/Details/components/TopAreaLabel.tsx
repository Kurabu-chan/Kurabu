import { Typography } from "#comps/themed/Typography";
import { MainColorSets, TypographicColorSetSetting, TypographyScales } from "@kurabu/theme";
import React from "react";
import { StyleSheet } from "react-native";

export const topAreaLabelTypographySettings = {
	colorVariant: "primary" as MainColorSets | "labels",
	isOnContainer: false as boolean,
	textKind: "paragraph" as TypographicColorSetSetting,
	variant: "body2" as TypographyScales,
}

export class TopAreaLabel extends React.Component<React.PropsWithChildren> {
	render() {
		return (
			<Typography
				{...topAreaLabelTypographySettings}
				style={topAreaLabelStyles.TopAreaLabel}
			>
				{this.props.children}
			</Typography>
		);
	}
}

export const topAreaLabelStyles = StyleSheet.create({
	TopAreaLabel: {
		fontWeight: "bold",
	}
});
