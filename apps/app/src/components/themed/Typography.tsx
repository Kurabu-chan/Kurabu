import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import {
	AppliedStyles,
	colors,
	FontCasing,
	FontStyle,
	FontWeight,
	MainColorSets,
	ProvidedTheme,
	resolve,
	ThemedComponent,
	TypographicColorSetSetting,
	typography,
	TypographyScales
} from "@kurabu/theme";
import React from "react";
import { TextProps, Text, TextStyle, StyleProp, StyleSheet } from "react-native";

type Props = {
	variant: TypographyScales,
	colorVariant: MainColorSets | "labels",
	isOnContainer: boolean,
	textKind: TypographicColorSetSetting
} & TextProps;

const RobotoFontMap: Record<FontWeight, string> = {
	"bold": "Roboto_Bold",
	"normal": "Roboto_Medium",
	"100": "Roboto_Thin",
	"200": "Roboto_Light",
	"300": "Roboto_Light",
	"400": "Roboto_Regular",
	"500": "Roboto_Medium",
	"600": "Roboto_Medium",
	"700": "Roboto_Bold",
	"800": "Roboto_Bold",
	"900": "Roboto_Black",
};

export function createTypographyStyles(
	variant: TypographyScales,
	textKind: TypographicColorSetSetting,
	isOnContainer: boolean,
	colorVariant: MainColorSets | "labels"): [Styles, (styles: AppliedStyles<Styles>, theme: ProvidedTheme, propertyStyles: StyleProp<TextStyle>) => StyleProp<TextStyle>] {
	
	let color: string;	
	
	if (colorVariant === "labels") {
		color = colors.onLabels(textKind)
	} else { 
		color = isOnContainer ? colors.onColor(colorVariant, textKind) : colors.onColorContainer(colorVariant, textKind)
	}
	
	const styles: Styles = ThemedStyleSheet.create({
		text: {
			fontSize: typography.fontSize(variant),
			fontWeight: typography.fontWeight(variant),
			fontFamily: typography.fontFamily(variant),
			letterSpacing: typography.letterSpacing(variant),
			fontStyle: typography.fontStyle(variant),
			color: color
		}
	})


	function apply(styles: AppliedStyles<Styles>, theme: ProvidedTheme, propertyStyles: StyleProp<TextStyle>): StyleProp<TextStyle> {

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const textCase: FontCasing = resolve(typography.case(variant), theme);
		const textTransform = textCase === "AllCaps" ? "uppercase" : "none";

		if (styles.text[1].fontFamily === "Roboto") {
			styles.text[1].fontFamily = RobotoFontMap[styles.text[1].fontWeight ?? 400];


			if (styles.text[1].fontStyle === "italic") {
				styles.text[1].fontStyle = "normal";
				styles.text[1].fontFamily += "_Italic";
			}
		}

		if (!Array.isArray(propertyStyles)) {
			propertyStyles = [propertyStyles];
		}

		const ret: StyleProp<TextStyle> = StyleSheet.flatten([
			{
				textTransform: textTransform,
				...styles.text[1]
			},
			...propertyStyles
		])
		console.log("ret",ret)
		return ret
	}

	return [styles, apply];
}

export class Typography extends ThemedComponent<Styles, Props> {
	applyTextStyle: (styles: AppliedStyles<Styles>, theme: ProvidedTheme, propertyStyles: StyleProp<TextStyle>) => StyleProp<TextStyle>;

	constructor(props: Props) {
		const styles = createTypographyStyles(props.variant, props.textKind, props.isOnContainer, props.colorVariant);
		super(styles[0], props);
		this.applyTextStyle = styles[1];
	}

	renderThemed(styles: AppliedStyles<Styles>, theme: ProvidedTheme): JSX.Element {
		return (
			<Text {...this.props} style={this.applyTextStyle(styles, theme, this.props.style)}>{this.props.children}</Text>
		);
	}
}

type Styles = {
	text: {
		fontSize: number
		fontWeight: FontWeight
		fontFamily: string
		letterSpacing: number
		fontStyle: FontStyle
		color: string
	}
}
