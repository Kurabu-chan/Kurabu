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
import { MangaRankingSource } from "#api/Manga/MangaRanking";

type PropsType = {
    navigation: StackNavigationProp<HomeStackParamList, "Home">;
    route: RouteProp<HomeStackParamList, "Home">;
};

type StateType = {
    node: {
        key: string;
        nodeSource: AnimeNodeSource;
    };
    listenerToUnMount: any;
};

export default class Home extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            node: {
                key: "Most popular Manga",
                nodeSource: new MangaRankingSource("bypopularity"),
            },
            listenerToUnMount: undefined,
        };
    }

    componentDidMount() {
        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage("Main");
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
                <View
                    style={{
                        flexDirection: "row",
                    }}>
                    <AnimeList
                        title={this.state.node.key}
                        animeNodeSource={this.state.node.nodeSource}
                        navigator={this.props.navigation as any}
                    />
                </View>
            </SafeAreaProvider>
        );
    }
}
