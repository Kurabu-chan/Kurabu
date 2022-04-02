import React from "react";
import { AnimeDetailsMainPicture } from "@kurabu/api-sdk";
import { FlatList } from "react-native-gesture-handler";
import { Dimensions, ListRenderItemInfo, SafeAreaView, StyleSheet, Text } from "react-native";
import { DetailsImageListItem } from "#comps/DetailsImageListItem";
import { StackNavigationProp } from "@react-navigation/stack";
import { DetailsStackParamList } from "#routes/MainStacks/DetailsStack";
import { RouteProp } from "@react-navigation/core";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "#config/Colors";

type Props = {
    navigation: StackNavigationProp<DetailsStackParamList, "DetailsImageListScreen">;
    route: RouteProp<DetailsStackParamList, "DetailsImageListScreen">;
}

export class DetailsImageList extends React.Component<Props> {
    render() {
        return (
            <SafeAreaView style={styles.appContainer}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={[
                        Colors.KURABUPINK,
                        Colors.KURABUPURPLE,
                        Colors.BACKGROUNDGRADIENT_COLOR1,
                        Colors.BACKGROUNDGRADIENT_COLOR2_DETAILS,
                    ]}
                    style={styles.linearGradient}>
                    <Text style={styles.title}>Pictures</Text>
                    <FlatList
                        data={this.props.route.params.picture}
                        numColumns={2}
                        renderItem={(props: ListRenderItemInfo<AnimeDetailsMainPicture>) => {
                            return (<DetailsImageListItem picture={props.item} navigation={this.props.navigation} />);
                        }}
                        style={styles.imageList}
                        contentContainerStyle={styles.imageListContentContainer}
                        keyExtractor={(item: AnimeDetailsMainPicture, index: number) => index.toString()}
                    />
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: Colors.INVISIBLE_BACKGROUND,
        flex: 1
    },
    imageList: {
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width
    },
    imageListContentContainer: {
        paddingBottom: 10
    },
    linearGradient: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        flex: 1
    },
    title: {
        fontSize: fontSize * 1.6,
        textAlign: "center",
        color: Colors.TEXT,
        paddingTop: 10
    }
});