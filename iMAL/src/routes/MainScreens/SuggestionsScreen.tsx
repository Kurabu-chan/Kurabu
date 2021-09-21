import { changeActivePage } from "#helpers/backButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimeSuggestionsSource from "#api/Anime/AnimeSuggestions";
import MediaNodeSource from "#api/MediaNodeSource";
import MediaList from "#comps/MediaList";
import { Colors } from "#config/Colors";

type StateType = {
    node: {
        key: string;
        nodeSource: MediaNodeSource;
    };
    listenerToUnMount: any;
};

export default class Suggestions extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            node: {
                key: "Suggestions for you",
                nodeSource: new AnimeSuggestionsSource(),
            },
            listenerToUnMount: undefined,
        };
    }

    componentDidMount() {
        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage("Suggestions");
            // The screen is focused
            // Call any action
        });

        this.setState((prevState) => ({
            ...prevState,
            listenerToUnMount: unsubscribe,
        }));
    }

    componentWillUnmount() {
        if (this.state.listenerToUnMount) this.state.listenerToUnMount();
    }

    render() {
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={[
                        Colors.KURABUPINK,
                        Colors.KURABUPURPLE,
                        Colors.BACKGROUNDGRADIENT_COLOR1,
                        Colors.BACKGROUNDGRADIENT_COLOR2,
                    ]}
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    }}>
                    <View
                        style={{
                            flexDirection: "row",
                        }}>
                        <MediaList
                            title={this.state.node.key}
                            mediaNodeSource={this.state.node.nodeSource}
                            navigator={this.props.navigation}
                        />
                    </View>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}
