import { Colors } from "#config/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
    height: number;
    color: string;
    min: number;
    max: number;
    current: number;
}

export class Progress extends React.PureComponent<Props>{ 
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <View style={{
                ...styles.progressContainer,
                height: this.props.height,
                backgroundColor: Colors.NO_BACKGROUND,
                borderColor: this.props.color,
            }}>
                <View style={{
                    ...styles.progress,
                    backgroundColor: this.props.color,
                    width: (this.props.current - this.props.min) / (this.props.max - this.props.min) * 100 + "%",
                    height: "100%",
                }}></View>
            </View>
        );
    }

    
}

const styles = StyleSheet.create({
    progressContainer: {
        borderWidth: 1,
        width: "100%",
    },
    progress: {

    }
});