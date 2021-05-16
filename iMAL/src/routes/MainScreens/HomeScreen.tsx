import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AnimeList from "../../components/AnimeList";
import SeasonalSource from "../../APIManager/Seasonal";
import AnimeNodeSource from "../../APIManager/AnimeNodeSource";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { changeActivePage } from "#routes/MainDrawer";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../Configuration/Colors";

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
                key: "Currently Airing",
                nodeSource: new SeasonalSource(2021, "spring"),
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
                            navigator={this.props.navigation as any}
                        />
                    </View>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}
