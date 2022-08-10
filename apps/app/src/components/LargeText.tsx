import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppliedStyles, colors, MainColorSets, sizing, ThemedComponent } from "@kurabu/theme";
import { Typography } from "./themed/Typography";

type Props = {
	text?: string;
	backgroundColorVariant: MainColorSets;
	isOnContainer: boolean
};

type State = {
    readmore: boolean;
    text?: string;
};

export class LargeText extends ThemedComponent<Styles, Props, State> {
    constructor(props: Props) {
        super(styles, props);
        this.state = {
            text: props.text,
            readmore: false,
        };
    }

    ShortedText(text: string) {
        if (text.length > 300) {
            return text.slice(0, 200) + "...";
        } else {
            return text;
        }
    }

    renderThemed(styles: AppliedStyles<Styles>) {
        if (this.state.text == undefined) return <Text>No synopsis</Text>;

        let text: string | undefined;
        let read: string | undefined;

        if (this.state.readmore) {
            text = this.state.text;
            read = "Read less";
        } else {
            text = this.ShortedText(this.state.text);
            read = "Read more";
        }

        return (
			<View>
				<Typography colorVariant={this.props.backgroundColorVariant} isOnContainer={false} textKind="paragraph" variant="body1">{text}</Typography>
                <Text style={styles.text}>{text}</Text>
                {this.state.text.length > 300 ? (
                    <TouchableOpacity
                        onPress={() => {
                            this.setState((prevState) => ({
                                ...prevState,
                                readmore: !prevState.readmore,
                            }));
                        }}
					>
						<Typography style={styles.ReadMore} colorVariant={this.props.backgroundColorVariant} isOnContainer={false} textKind="link" variant="body1">{read}</Typography>
                    </TouchableOpacity>
                ) : undefined}
            </View>
        );
    }
}

type Styles = typeof styles;
const styles = StyleSheet.create({
    text: {
        color: colors.onColor("background", "paragraph"),
        fontSize: 13,
    },
    ReadMore: {
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
		textDecorationColor: colors.onColor("background", "link"),
    },
});
