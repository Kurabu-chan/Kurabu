import { changeActivePage } from "#helpers/backButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {AnimeSuggestionsSource} from "#data/anime/AnimeSuggestionsSource";
import {MediaListSource} from "#data/MediaListSource";
import MediaList, { mediaListFields } from "#comps/MediaList";
import { Colors } from "#config/Colors";
import { SuggestionsStackParamList } from "#routes/MainStacks/SuggestionsStack";
import { StackScreenProps } from "@react-navigation/stack";

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
                    }}
                >
                    <View
                        style={styles.listContainer}
                    >
                        <MediaList
                            title={this.state.node.key}
                            mediaNodeSource={this.state.node.nodeSource}
                            navigator={this.props.navigation}
                        />
                    </View>
                </LinearGradient>
            </SafeAreaProvider>
        );
    }
}

const styles = StyleSheet.create({
    safeAreaProvider: {
        backgroundColor: Colors.ALTERNATE_BACKGROUND,
    },
    listContainer: {
        flexDirection: "row",
    }
});