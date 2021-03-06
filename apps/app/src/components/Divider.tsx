import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "#config/Colors";

type Props = {
    color?: string;
    widthPercentage?: number;
    margin?: boolean;
};

type State = {
    color: string;
    widthPercentage: number;
    margin?: boolean;
};

export class Divider extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            color: props.color ?? Colors.DIVIDER,
            widthPercentage: props.widthPercentage ?? 90,
            margin: props.margin ?? true,
        };
    }

    render() {
        const styles = StyleSheet.create({
            divider: {
                width: `${this.state.widthPercentage}%`,
                height: 1,
                backgroundColor: this.state.color,
                marginLeft: `${(100 - this.state.widthPercentage) / 2}%`,
                marginTop: this.state.margin ? 5 : 0,
                marginBottom: this.state.margin ? 5 : 0,
            },
        });

        return <View style={styles.divider}></View>;
    }
}
