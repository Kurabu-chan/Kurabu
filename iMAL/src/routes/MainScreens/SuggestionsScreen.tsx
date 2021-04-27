import React from "react";
import { FlatList, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimeList from "../../components/AnimeList";
import SeasonalSource from "../../APIManager/Seasonal";
import { NavigationStackScreenProps } from "react-navigation-stack";
import AnimeNodeSource from "../../APIManager/AnimeNodeSource";
import SuggestionsSource from "../../APIManager/Suggestions";

type StateType = {
    node: {
        key: string;
        nodeSource: AnimeNodeSource;
    };
};

export default class Suggestions extends React.Component<
    NavigationStackScreenProps,
    StateType
> {
    constructor(props: NavigationStackScreenProps) {
        super(props);
        this.state = {
            node: {
                key: "Suggestions for you",
                nodeSource: new SuggestionsSource(),
            },
        };
    }

    render() {
        return (
            <SafeAreaProvider style={{ backgroundColor: "#1a1a1a" }}>
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
            </SafeAreaProvider>
        );
    }
}
