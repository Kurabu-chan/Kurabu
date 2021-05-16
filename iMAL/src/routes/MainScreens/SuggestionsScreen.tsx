import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimeList from "../../components/AnimeList";
import AnimeNodeSource from "../../APIManager/AnimeNodeSource";
import SuggestionsSource from "../../APIManager/Suggestions";
import { changeActivePage } from "#routes/MainDrawer";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../Configuration/Colors";

type StateType = {
    node: {
        key: string;
        nodeSource: AnimeNodeSource;
    };
    listenerToUnMount: any;
};

export default class Suggestions extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            node: {
                key: "Suggestions for you",
                nodeSource: new SuggestionsSource(),
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
                        Colors.BACKGROUNDGRADIENT_COLOR2
                    ]}
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                        }}>
                        <AnimeList
                            title={this.state.node.key}
                            animeNodeSource={this.state.node.nodeSource}
                            navigator={this.props.navigation}
                        />
                    </View>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}
