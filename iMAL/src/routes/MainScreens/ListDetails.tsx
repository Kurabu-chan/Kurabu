import { GetAnimeListStatus } from "#api/Anime/List/AnimeListStatus";
import { ListStatus, UpdateListStatusResult, UpdateListStatusResultAnime } from "#api/ApiBasicTypes";
import { GetMangaListStatus } from "#api/Manga/List/MangaListStatus";
import { Divider } from "#comps/Divider";
import MediaItem from "#comps/MediaItem";
import { Colors } from "#config/Colors";
import { changeActivePage, changeBackButton, getActivePage } from "#helpers/backButton";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import TimeAgo from "react-native-timeago";

type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "ListDetailsScreen">;
    route: RouteProp<HomeStackParamList, "ListDetailsScreen">;
};

type State = {
    mediaId?: number;
    listStatus?: UpdateListStatusResult;
    listenerToUnMount: any;
    page: string;
    mediaType: string;
};


var sizer = Dimensions.get("window").width / 400;

export class ListDetails extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        let mediaId = props.route.params.id;
        let mediaType = props.route.params.media_type;
        if (mediaId == undefined) {
            mediaId = 1;
        }
        console.log(`${mediaType} ${mediaId}`);
        this.state = {
            mediaId: mediaId,
            listenerToUnMount: undefined,
            page: getActivePage(),
            mediaType: mediaType,
        };

        const mangaMediatTypes = [
            "manga",
            "light_novel",
            "manhwa",
            "one_shot",
            "manhua",
            "doujinshi",
            "novel",
        ];

        if (mangaMediatTypes.includes(mediaType)) {
            GetMangaListStatus(mediaId)
                .then((res) => {
                    this.setState({
                        mediaId: mediaId,
                        listStatus: res,
                    });
                })
                .catch((err) => {
                    console.log("Manga list details error weewooweewoo");
                    console.log(err);
                });
        } else {
            GetAnimeListStatus(mediaId)
                .then((res) => {
                    this.setState({
                        mediaId: mediaId,
                        listStatus: res,
                    });
                })
                .catch((err) => {
                    console.log("Anime list details error weewooweewoo");
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        changeBackButton(this.state.page as any, () => {
            this.props.navigation.popToTop();
            changeBackButton(this.state.page as any, undefined);
        });

        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage(this.state.page as any);
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
        return (<SafeAreaView style={styles.appContainer}>
            <LinearGradient
                // Background Linear Gradient
                colors={[
                    Colors.KURABUPINK,
                    Colors.KURABUPURPLE,
                    Colors.BACKGROUNDGRADIENT_COLOR1,
                    Colors.BACKGROUNDGRADIENT_COLOR2_DETAILS,
                ]}
                style={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height,
                }}>
                {this.state.listStatus == undefined ? (
                    <ActivityIndicator
                        style={styles.loading}
                        size="large"
                        color={Colors.BLUE}
                    />
                ) : (
                    <ScrollView style={styles.page}>
                        <View style={styles.TopAreaData}>
                            <View style={styles.TopAreaLabels}>
                                <Text style={styles.TopAreaLabel}>
                                    Status:
                                </Text>
                                <Text style={styles.TopAreaLabel}>
                                    Score:
                                </Text>
                                <Text style={styles.TopAreaLabel}>
                                    Updated:
                                </Text>
                            </View>
                            <View style={styles.TopAreaValues}>
                                <Text style={styles.TopAreaValue}>
                                    {this.state.listStatus.status}
                                </Text>
                                <Text style={styles.TopAreaValue}>
                                    #{this.state.listStatus.score}
                                </Text>
                                <Text style={styles.TopAreaValue}>
                                    <TimeAgo time={this.state.listStatus.updated_at ?? ""} interval={5000} />
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                height: 80,
                                width: 5,
                            }}
                        />
                    </ScrollView>
                )}
            </LinearGradient>
        </SafeAreaView>)
    }
}

var fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: Colors.INVISIBLE_BACKGROUND,
    },
    loading: {
        marginTop: Dimensions.get("window").height / 2,
    },
    image: {
        width: Dimensions.get("window").width / 2.5,
        height: (Dimensions.get("window").width / 2.5) * 1.5,
    },
    title: {
        color: Colors.TEXT,
        fontSize: fontSize + 4,
        marginLeft: 5,
    },
    alternateTitle: {
        color: Colors.SUBTEXT,
        marginLeft: 5,
        fontSize: fontSize + 2,
    },
    page: {
        margin: 10,
    },
    TopArea: {
        flexDirection: "row",
        alignItems: "stretch",
        width: Dimensions.get("window").width - 20,
        marginBottom: 10,
    },
    TitleArea: {
        flexDirection: "column",
        marginLeft: 10,
        flex: 1,
    },
    Synopsis: {
        color: Colors.TEXT,
    },
    ReadMore: {
        color: Colors.BLUE,
        textDecorationStyle: "solid",
        textDecorationLine: "underline",
        textDecorationColor: Colors.BLUE,
        fontSize: fontSize,
    },
    head2: {
        fontSize: fontSize + 4,
        color: Colors.TEXT,
    },
    TopAreaLabels: {
        flexDirection: "column",
        flex: 1.3,
    },
    TopAreaValues: {
        flexDirection: "column",
        flex: 2,
    },
    TopAreaData: {
        flexDirection: "row",
    },
    TopAreaLabel: {
        color: Colors.TEXT,
        fontWeight: "bold",
        fontSize: 12,
    },
    TopAreaValue: {
        color: Colors.TEXT,
        fontSize: 12,
    }
});
