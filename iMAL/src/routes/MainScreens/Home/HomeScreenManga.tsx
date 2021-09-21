import { MangaRankingSource } from "#api/Manga/MangaRanking";
import { changeActivePage } from "#helpers/backButton";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MediaNodeSource from "#api/MediaNodeSource";
import MediaList from "../../../components/MediaList";
import { Colors } from "../../../config/Colors";

type PropsType = {
    navigation: StackNavigationProp<HomeStackParamList, "Home">;
    route: RouteProp<HomeStackParamList, "Home">;
};

type StateType = {
    node: {
        key: string;
        nodeSource: MediaNodeSource;
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
            <SafeAreaProvider style={{ backgroundColor: Colors.BACKGROUND }}>
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
                            navigator={this.props.navigation as any}
                        />
                    </View>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}
