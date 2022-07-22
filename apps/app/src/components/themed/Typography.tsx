import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { AppliedStyles, colors, FontCasing, FontStyle, FontWeight, MainColorSets, ProvidedTheme, resolve, ThemedComponent, TypographicColorSetSetting, typography, TypographyScales } from "@kurabu/theme";
import React from "react";
import { TextProps, Text, View } from "react-native";

type Props = {
    variant: TypographyScales,
    colorVariant: MainColorSets,
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

export class Typography extends ThemedComponent<Styles, Props> {
    constructor(props: Props) {
        const styles = ThemedStyleSheet.create({
            text: {
                fontSize: typography.fontSize(props.variant),
                fontWeight: typography.fontWeight(props.variant),
                fontFamily: typography.fontFamily(props.variant),
                letterSpacing: typography.letterSpacing(props.variant),
                fontStyle: typography.fontStyle(props.variant),
                color: props.isOnContainer ? colors.onColor(props.colorVariant, props.textKind) : colors.onColorContainer(props.colorVariant, props.textKind)
            }
        })

        super(styles, props);
    }

    renderThemed(styles: AppliedStyles<Styles>, theme: ProvidedTheme): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const textCase: FontCasing = resolve(typography.case(this.props.variant), theme);
        const textTransform = textCase === "AllCaps" ? "uppercase" : "none";

        if (styles.text[1].fontFamily === "Roboto") { 
            styles.text[1].fontFamily = RobotoFontMap[styles.text[1].fontWeight ?? 400];
            

            if(styles.text[1].fontStyle === "italic") {
                styles.text[1].fontStyle = "normal";
                styles.text[1].fontFamily += "_Italic";
            }
        }

        return (
            <Text {...this.props} style={
                [
                    {
                        textTransform: textTransform,
                        ...styles.text[1]
                    },
                    this.props.style
                ]
            }>{this.props.children}</Text>
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
