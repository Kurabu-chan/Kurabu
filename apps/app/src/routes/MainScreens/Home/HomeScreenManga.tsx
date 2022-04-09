import { MangaRankingSource } from "#data/manga/MangaRankingSource";
import { changeActivePage } from "#helpers/backButton";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import MediaList, { mediaListFields } from "#comps/MediaList";
import { Colors } from "#config/Colors";

type Props = StackScreenProps<HomeStackParamList, "HomeScreen">;

type StateType = {
    node: {
        key: string;
        nodeSource: MediaListSource;
    };
    listenerToUnMount?: () => void;
};

export default class Home extends React.Component<Props, StateType> {
    constructor(props: Props) {
        super(props);
        
        this.state = {
            node: {
                key: "Most popular Manga",
                nodeSource: new MangaRankingSource(mediaListFields, "bypopularity"),
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
            <SafeAreaProvider
                style={styles.safeAreaProvider}
            >
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
                        ...styles.gradient
                    }}
                >
                    <View
                        style={styles.mediaListContainer}
                    >
                        <MediaList
                            title={this.state.node.key}
                            mediaNodeSource={this.state.node.nodeSource}
                            navigator={this.props.navigation }
                        />
                    </View>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    mediaListContainer: {
        flexDirection: "row",
    },
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
        flex: 1,
    },
    gradient: {
        flex: 1,
    }
});
