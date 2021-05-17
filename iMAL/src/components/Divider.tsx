import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../Configuration/Colors";

type Props = {
    color?: string;
    widthPercentage?: number;
};

type State = {
    color: string;
    widthPercentage: number;
};

export class Divider extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            color: props.color ?? Colors.DIVIDER,
            widthPercentage: props.widthPercentage ?? 90,
        };
    }

    render() {
        let styles = StyleSheet.create({
            divider: {
                width: `${this.state.widthPercentage}%`,
                height: 1,
                backgroundColor: this.state.color,
                marginLeft: `${(100 - this.state.widthPercentage) / 2}%`,
                marginTop: 5,
                marginBottom: 5,
            },
        });

        return <View style={styles.divider}></View>;
    }
}
