import { Typography } from "#comps/themed/Typography";
import React from "react";
import { StyleSheet } from "react-native";

export class TopAreaValue extends React.Component<React.PropsWithChildren> {
	render() {
		return (
			<Typography
				colorVariant="primary"
				isOnContainer={false}
				textKind="paragraph"
				variant="body2"
				style={styles.TopAreaValue}
			>
				{this.props.children}
			</Typography>
		);
	}
}

const styles = StyleSheet.create({
	TopAreaValue: {
	}
});
