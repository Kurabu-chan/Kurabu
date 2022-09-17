import { colors, resolve, useThemeProvider } from "@kurabu/theme";
import React, { useState } from "react";
import { TextStyle, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Icon } from "react-native-elements";

export function Picker<T extends string>(props:
	{
		value: T | null,
		items: {
			label: string, value: T
		}[],
		setValue: (value: T) => void,
		style: TextStyle,
		dropDownBackgroundColor: string
	}) {
	const [isOpen, setOpen] = useState(false);

	const providedTheme = useThemeProvider();

	return (
		<DropDownPicker
			open={isOpen}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			setOpen={setOpen}
			value={props.value}
			listMode="SCROLLVIEW"
			setValue={(val) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				props.setValue(val(null))
			}}
			textStyle={StyleSheet.flatten([defaultStyles.text, extractTextStyles(props.style)])}
			style={StyleSheet.flatten([defaultStyles.container, extractContainerStyles(props.style)])}
			dropDownContainerStyle={StyleSheet.flatten([defaultStyles.container, extractContainerStyles(props.style), {
				backgroundColor: props.dropDownBackgroundColor
			}])}
			ArrowDownIconComponent={() => {
				return <Icon
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					color={resolve(colors.onColor("secondary", "paragraph"), providedTheme)}
					tvParallaxProperties={{}}
					// type="font-awesome"
					name="keyboard-arrow-down" />
			}}
			ArrowUpIconComponent={() => {
				return <Icon
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					color={resolve(colors.onColor("secondary", "paragraph"), providedTheme)}
					tvParallaxProperties={{}}
					name="keyboard-arrow-up" />
			}}
			TickIconComponent={() => {
				return <Icon
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					color={resolve(colors.onColor("secondary", "paragraph"), providedTheme)}
					tvParallaxProperties={{}}
					name="done" />
			}}

			items={props.items}
		/>
	);
}

const textStyleProps: (keyof TextStyle)[] = [
	"color",
	"fontFamily",
	"fontSize",
	"fontStyle",
	"fontWeight",
	"textAlign",
	"textDecorationLine",
	"textDecorationStyle",
	"textDecorationColor",
	"textShadowColor",
	"textShadowOffset",
	"textShadowRadius",
	"textTransform",
	"letterSpacing",
	"lineHeight",
	"textAlignVertical",
	"writingDirection",
	"includeFontPadding",
]

function extractTextStyles(style: TextStyle): TextStyle {
	const textStyle: TextStyle = {};
	for (const textStyleProp of textStyleProps) {
		if (textStyleProp in style) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			textStyle[textStyleProp] = style[textStyleProp] as any;	
		}
	}

	return textStyle;
}

function extractContainerStyles(style: TextStyle): TextStyle {
	const containerStyle: TextStyle = {};
	for (const styleProp of Object.keys(style) as (keyof TextStyle)[]) {
		if (!(styleProp in textStyleProps)) { 
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			containerStyle[styleProp] = style[styleProp] as any;
		}
	}

	return containerStyle;
}

const defaultStyles = StyleSheet.create({
	text: {

	},
	container: {

	}
});




