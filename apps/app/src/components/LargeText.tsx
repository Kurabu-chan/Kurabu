import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "#config/Colors";

type Props = {
    text?: string;
};

type State = {
    readmore: boolean;
    text?: string;
};

export class LargeText extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
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

    render() {
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
                        <Text style={styles.ReadMore}>{read}</Text>
                    </TouchableOpacity>
                ) : undefined}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: Colors.TEXT,
        fontSize: 13,
    },
    ReadMore: {
        color: Colors.BLUE,
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        textDecorationColor: Colors.BLUE,
        fontSize: 12,
        marginBottom: 15,
    },
});
