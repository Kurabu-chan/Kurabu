import { changeActivePage } from "#helpers/backButton";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {AnimeSuggestionsSource} from "#data/anime/AnimeSuggestionsSource";
import {MediaListSource} from "#data/MediaListSource";
import MediaList, { mediaListFields } from "#comps/MediaList";
import { Colors } from "#config/Colors";
import { SuggestionsStackParamList } from "#routes/MainStacks/SuggestionsStack";
import { StackScreenProps } from "@react-navigation/stack";
import { MainGradientBackground } from "#comps/MainGradientBackground";

type Props = StackScreenProps<SuggestionsStackParamList, "SuggestionsScreen">

type StateType = {
    node: {
        key: string;
        nodeSource: MediaListSource;
    };
    listenerToUnMount?: () => void;
};

export default class Suggestions extends React.Component<Props, StateType> {
    constructor(props: Props) {
        super(props);
        this.state = {
            node: {
                key: "Suggestions for you",
                nodeSource: new AnimeSuggestionsSource(mediaListFields),
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
            <SafeAreaProvider
                style={styles.safeAreaProvider}
            >
                <MainGradientBackground>
                    <View
                        style={styles.listContainer}
                    >
                        <MediaList
                            title={this.state.node.key}
                            mediaNodeSource={this.state.node.nodeSource}
                            navigator={this.props.navigation}
                        />
                    </View>
                </MainGradientBackground>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
        flex: 1
    },
    listContainer: {
        flexDirection: "row",
    }
});
