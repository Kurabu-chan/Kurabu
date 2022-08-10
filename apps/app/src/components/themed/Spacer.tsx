import { AppliedStyles, ProvidedTheme, resolve, sizing, Spacing, ThemedComponent } from "@kurabu/theme";
import { View } from "react-native";

type Props = {
	direction: "horizontal" | "vertical";
	spacing: Spacing
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class Spacer extends ThemedComponent<{}, Props>{ 
	constructor(props: Props) { 
		super({}, props);
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	renderThemed(styles: AppliedStyles<{}>, theme: ProvidedTheme) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const spacing: string = resolve(sizing.spacing(this.props.spacing), theme);

		// eslint-disable-next-line react-native/no-inline-styles
		return (<View style={{
			width: this.props.direction === "horizontal" ? spacing : 1,
			height: this.props.direction === "vertical" ? spacing : 1,
		}}></View>);
	}
}
