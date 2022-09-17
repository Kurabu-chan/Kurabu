import { MangaRankingSource } from "#data/manga/MangaRankingSource";
import { changeActivePage } from "#helpers/backButton";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MediaListSource } from "#data/MediaListSource";
import MediaList, { mediaListFields } from "#comps/MediaList";
import { Colors } from "#config/Colors";
import { MainGradientBackground } from "#comps/MainGradientBackground";

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
				<MainGradientBackground>
                    <View
                        style={styles.mediaListContainer}
                    >
                        <MediaList
                            title={this.state.node.key}
                            mediaNodeSource={this.state.node.nodeSource}
                            navigator={this.props.navigation }
                        />
                    </View>
                </MainGradientBackground>
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
    }
});
