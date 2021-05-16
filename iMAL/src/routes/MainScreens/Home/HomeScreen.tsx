import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimeList from "../../../components/AnimeList";
import AnimeSeasonalSource from "../../../APIManager/Anime/AnimeSeasonal";
import AnimeNodeSource from "../../../APIManager/AnimeNodeSource";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { changeActivePage } from "#routes/MainDrawer";

type PropsType = {
    navigation: StackNavigationProp<HomeStackParamList, "Home">;
    route: RouteProp<HomeStackParamList, "Home">;
};

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
                nodeSource: new AnimeSeasonalSource(2021, "spring"),
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
