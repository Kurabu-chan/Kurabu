import { Typography } from "#comps/themed/Typography";
import React from "react";
import { StyleSheet } from "react-native";

export class TopAreaLabel extends React.Component<React.PropsWithChildren> {
	render() {
		return (
			<Typography
				colorVariant="primary"
				isOnContainer={false}
				textKind="paragraph"
				variant="body2"
				style={styles.TopAreaLabel}
			>
				{this.props.children}
			</Typography>
		);
	}
}

const styles = StyleSheet.create({
	TopAreaLabel: {
		fontWeight: "bold",
	}
});
