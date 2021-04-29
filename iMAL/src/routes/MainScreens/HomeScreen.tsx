import React from "react";
import { FlatList, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimeList from "../../components/AnimeList";
import SeasonalSource from "../../APIManager/Seasonal";
import AnimeNodeSource from "../../APIManager/AnimeNodeSource";

type StateType = {
    node: {
        key: string;
        nodeSource: AnimeNodeSource;
    };
};

export default class Home extends React.Component<any, StateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            node: {
                key: "Currently Airing",
                nodeSource: new SeasonalSource(2021, "spring"),
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
