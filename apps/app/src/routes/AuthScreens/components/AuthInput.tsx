import React from "react";
import { TextInput, View, StyleSheet, ViewStyle, StyleProp, TextStyle } from "react-native";
import { AppliedStyles, applyUnfrozen, colors, ProvidedTheme, sizing, ThemedComponent, useTheme } from "@kurabu/theme"
import { createTypographyStyles } from "../../../components/themed/Typography"

type Props = {
	value: string,
	onChangeText: (a: string) => void,
	placeholder: string,
	secureTextEntry?: boolean,
	autoComplete: typeof TextInput.prototype.props.autoComplete,
	containerStyle?: StyleProp<ViewStyle>,
	inputStyle?: StyleProp<TextStyle>,
	onFocus?: () => void,
	onLostFocus?: () => void,
}

export class AuthInput extends ThemedComponent<Styles, Props> {
	constructor(props: Props) {
		super(styles, props);
	}

	
	renderThemed(styles: AppliedStyles<Styles>, theme: ProvidedTheme): JSX.Element {
		const textStyles = textStyle[1]({
			text: styles.Input
		}, theme, {})

		styles.InputContainer[1].backgroundColor = styles.InputContainer[1].backgroundColor! + "99";



		const color = applyUnfrozen({
			colors: {
				placeholder: colors.onColorContainer("background", "subText")
			}
		}, theme);

		return (
			<View style={StyleSheet.flatten([styles.InputContainer, this.props.containerStyle])}>
				<TextInput
					onChangeText={(text) => {
						this.props.onChangeText(text);
					}}
					placeholder={this.props.placeholder}
					autoComplete={this.props.autoComplete}
					placeholderTextColor={color.colors.placeholder}

					secureTextEntry={this.props.secureTextEntry}
					style={StyleSheet.flatten(textStyles)}
					value={this.props.value}
					onFocus={this.props.onFocus}
					onBlur={this.props.onLostFocus}
				/>
			</View>
		);
	} 
}

const textStyle = createTypographyStyles("headline4", "paragraph", true, "background");

type Styles = typeof styles;
const styles = StyleSheet.create({
	InputContainer: {
		padding: 5,
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,
		backgroundColor: colors.colorContainer("background"),
	},
	Input: {
		opacity: 1,
		width: "100%",
		height: "100%",
		borderBottomWidth: 1,
		borderColor: colors.onColorContainer("background", "paragraph"),
		...textStyle[0].text,
	}
});

