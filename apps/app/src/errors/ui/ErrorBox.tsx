import { Typography } from "#comps/themed/Typography";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, colors, sizing, ThemedComponent } from "@kurabu/theme";
import { View } from "react-native";
import { ErrorManager } from "../ErrorManager";
import { KurabuError } from "../KurabuError";

type Props<TError extends KurabuError> = {
	errors: Err<TError>[]
}

type State = {
	hidden: boolean,
	errorMessage: string
}

type Err<TError extends KurabuError> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error: new(...args: any[]) => TError,
	onError?: (error: KurabuError) => void
}

export class ErrorBox<TError extends KurabuError> extends ThemedComponent<Styles, Props<TError>, State> {
	constructor(props: Props<TError>) {
		super(styles, props)

		for (const error of this.props.errors) {
			ErrorManager.instance.handleError(error.error, (err: KurabuError) => {
				if (error.onError !== undefined) error.onError(err);

				this.setState({
					hidden: false,
					errorMessage: err.getUserFriendlyMessage()
				});
			})
		}

		this.state = {
			hidden: true,
			errorMessage: ""
		}
	}

	public clear() {
		this.setState({...this.state, hidden: true});
	}

	renderThemed(styles: AppliedStyles<Styles>) {
		return (
			<View style={this.state.hidden ? styles.hidden : undefined}>
				<View style={styles.errorContainer}>
					<Typography colorVariant="status.danger" isOnContainer={false} textKind="header" variant="headline4">
						{this.state.errorMessage}
					</Typography>
				</View>
			</View>
		);
	}
}

type Styles = typeof styles;
const styles = ThemedStyleSheet.create({
	hidden: {
		opacity: 0
	},
	errorContainer: {
		padding: sizing.spacing("medium"),
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		borderRadius: sizing.rounding("small") as number,
		borderColor: colors.status("danger", "border"),
		backgroundColor: colors.status("danger", "color"),
		margin: sizing.spacing("medium"),
	}
});
