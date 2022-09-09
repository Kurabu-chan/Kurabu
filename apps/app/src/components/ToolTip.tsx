import React from 'react';
import {
	View,
	StyleProp,
	ViewStyle,
	StyleSheet
} from 'react-native';
import { Typography } from './themed/Typography';

export function ToolTip(props: {
	title: string,
	text: string,
	enabled: boolean,
	children: JSX.Element | JSX.Element[],
	style: StyleProp<ViewStyle>,
	tooltipContainerStyle: StyleProp<ViewStyle>,
	tooltipTextProps: typeof Typography.prototype.props
	tooltipTitleProps: typeof Typography.prototype.props
}) {
	return (
		<View
			style={StyleSheet.flatten([
				{
					position: 'relative',
				},
				props.style,
			])}>
			{props.enabled ? (
				<View
					style={StyleSheet.flatten([styles.tooltipContainer, props.tooltipContainerStyle])}>
					<Typography {...props.tooltipTitleProps}>{props.title}</Typography>
					<Typography {...props.tooltipTextProps}>{props.text}</Typography>
				</View>
			) : undefined}
			{props.children}
		</View>
	);
}

const styles = StyleSheet.create({
	tooltipContainer: {
		position: 'absolute',
		bottom: '100%',
	}
});
