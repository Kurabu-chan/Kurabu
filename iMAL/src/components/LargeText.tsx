import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "../Configuration/Colors";

type Props = {
    text?: string
}

type State = {
    readmore: boolean,
    text?: string
}

export class LargeText extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            text: props.text,
            readmore: false
        }
    }

    ShortedText(text: string){
        if(text.length > 300){
            return text.slice(0,200) + "...";
        }else{
            return text;
        }       
    }

    render() {
        if (this.state.text == undefined) return (<Text>No synopsis</Text>)

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
                {this.state.text.length > 300? <TouchableOpacity onPress={() => {
                    this.setState({ ...this.state, readmore: !this.state.readmore })
                }}>
                    <Text style={styles.ReadMore}>{read}</Text>
                </TouchableOpacity>:undefined}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: Colors.TEXT
    },
    ReadMore: {
        color: Colors.BLUE,
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        textDecorationColor: Colors.BLUE,
        fontSize: 15,
        marginBottom: 15
    }
});