import React from "react";
import { PixelRatio, StyleSheet, View } from "react-native";
import { AppliedStyles, colors, MainColorSets, ProvidedTheme, resolve, ThemedComponent } from "@kurabu/theme";

type Props = {
    variant: MainColorSets;
    isOnContainer: boolean;
    widthPercentage?: number;
    margin?: boolean;
};

export class Divider extends ThemedComponent<Styles, Props> {
    constructor(props: Props) {
        super(styles, props);
    }

    renderThemed(styles: AppliedStyles<Styles>, theme: ProvidedTheme) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const color = resolve(this.props.isOnContainer ? colors.onColorContainer(this.props.variant, "subText") : colors.onColor(this.props.variant, "subText"), theme)

        // eslint-disable-next-line react-native/no-inline-styles
        return <View style={[...styles.divider, {
            width: `${this.props.widthPercentage ?? 100}%`,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            backgroundColor: color,
            marginLeft: `${(100 - (this.props.widthPercentage ?? 100)) / 2}%`,
            marginTop: this.props.margin ? 5 : 0,
            marginBottom: this.props.margin ? 5 : 0,
        }]}></View>;
    }
}

type Styles = typeof styles;
const styles = StyleSheet.create({
    divider: {
        height: 2 / PixelRatio.get(),
    },
});
