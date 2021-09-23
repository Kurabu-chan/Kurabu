import { GetAnimeListStatus } from "#api/Anime/List/AnimeListStatus";
import { ListStatus, UpdateListStatusResult, UpdateListStatusResultAnime, UpdateListStatusResultManga } from "#api/ApiBasicTypes";
import { GetMangaListStatus } from "#api/Manga/List/MangaListStatus";
import { Divider } from "#comps/Divider";
import MediaItem from "#comps/MediaItem";
import { Colors } from "#config/Colors";
import { changeActivePage, changeBackButton, getActivePage } from "#helpers/backButton";
import { niceTextFormat } from "#helpers/textFormatting";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import TimeAgo from "react-native-timeago";

type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "ListDetailsScreen">;
    route: RouteProp<HomeStackParamList, "ListDetailsScreen">;
};

type State = {
    mediaId: number;
    listStatus?: UpdateListStatusResult;
    listenerToUnMount: any;
    page: string;
    mediaType: string;
    isAnime: boolean;
    isEditing: boolean;
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


        const mangaMediatTypes = [
            "manga",
            "light_novel",
            "manhwa",
            "one_shot",
            "manhua",
            "doujinshi",
            "novel",
        ];
        const isAnime = !mangaMediatTypes.includes(mediaType)
        this.state = {
            mediaId: mediaId,
            listenerToUnMount: undefined,
            page: getActivePage(),
            mediaType: mediaType,
            isAnime: isAnime,
            isEditing: false
        };

        this.refresh();
    }

    refresh() {

        if (!this.state.isAnime) {
            GetMangaListStatus(this.state.mediaId)
                .then((res) => {
                    this.setState({
                        mediaId: this.state.mediaId,
                        listStatus: res,
                        isEditing: false
                    });
                })
                .catch((err) => {
                    console.log("Manga list details error weewooweewoo");
                    console.log(err);
                });
        } else {
            GetAnimeListStatus(this.state.mediaId)
                .then((res) => {
                    this.setState({
                        mediaId: this.state.mediaId,
                        listStatus: res,
                        isEditing: false
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

    renderAnime(listStatus: UpdateListStatusResultAnime) {
        return (<View style={styles.Table}>
            <View style={styles.Labels}>
                <Text style={styles.Label}>
                    Status:
                </Text>
                <Text style={styles.Label}>
                    Watched episodes:
                </Text>
                <Text style={styles.Label}>
                    Score:
                </Text>
                <Text style={styles.Label}>
                    Priority:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Rewatching:
                </Text>
                <Text style={styles.Label}>
                    Num times rewatched:
                </Text>
                <Text style={styles.Label}>
                    Rewatch value:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Comments:
                </Text>
                <Text style={styles.Label}>
                    Tags:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Updated:
                </Text>
            </View>
            {this.state.isEditing == true ? this.animeEditing(listStatus) : this.animeDisplay(listStatus)}
        </View>)
    }

    renderManga(listStatus: UpdateListStatusResultManga) {
        return (<View style={styles.Table}>
            <View style={styles.Labels}>
                <Text style={styles.Label}>
                    Status:
                </Text>
                <Text style={styles.Label}>
                    Chapters read:
                </Text>
                <Text style={styles.Label}>
                    Volumes read:
                </Text>
                <Text style={styles.Label}>
                    Score:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Rereading:
                </Text>
                <Text style={styles.Label}>
                    Number of times reread:
                </Text>
                <Text style={styles.Label}>
                    Reread value:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Updated:
                </Text>
            </View>
            {this.state.isEditing ? this.mangaEditing(listStatus) : this.mangaDisplay(listStatus)}
        </View>)
    }

    animeDisplay(listStatus: UpdateListStatusResultAnime) {
        return (<View style={styles.Values}>
            <Text style={styles.Value}>
                {niceTextFormat(listStatus.status)}
            </Text>
            <Text style={styles.Value}>
                {listStatus.num_episodes_watched}
            </Text>
            <Text style={styles.Value}>
                # {listStatus.score}
            </Text>
            <Text style={styles.Value}>
                {listStatus.priority}
            </Text>

            <Text style={styles.Value}>

            </Text>

            <Text style={styles.Value}>
                {listStatus.is_rewatching == true ? "yes" : "no"}
            </Text>
            <Text style={styles.Value}>
                {listStatus.num_times_rewatched}
            </Text>
            <Text style={styles.Value}>
                {listStatus.rewatch_value}
            </Text>

            <Text style={styles.Value}>

            </Text>


            <Text style={styles.Value}>
                {(listStatus.comments ?? "") == "" ? "N/A" : listStatus.comments}
            </Text>
            <Text style={styles.Value}>
                {listStatus.tags == undefined || listStatus.tags.length == 0 ? "N/A" : listStatus.tags.join(", ")}
            </Text>

            <Text style={styles.Value}>

            </Text>

            <Text style={styles.Value}>
                <TimeAgo time={listStatus.updated_at ?? ""} interval={5000} />
            </Text>
        </View>);
    }

    animeEditing(listStatus: UpdateListStatusResultAnime) {
        return (
            <View style={styles.Values}>
                <Text style={styles.Value}>
                    {niceTextFormat(listStatus.status)}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_episodes_watched}
                </Text>
                <Text style={styles.Value}>
                    ## {listStatus.score}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.priority}
                </Text>

                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    {listStatus.is_rewatching == true ? "yes" : "no"}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_times_rewatched}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.rewatch_value}
                </Text>

                <Text style={styles.Value}>

                </Text>


                <Text style={styles.Value}>
                    {(listStatus.comments ?? "") == "" ? "N/A" : listStatus.comments}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.tags == undefined || listStatus.tags.length == 0 ? "N/A" : listStatus.tags.join(", ")}
                </Text>

                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    <TimeAgo time={listStatus.updated_at ?? ""} interval={5000} />
                </Text>
            </View>)
    }

    mangaDisplay(listStatus: UpdateListStatusResultManga) {
        return (
            <View style={styles.Values}>
                <Text style={styles.Value}>
                    {niceTextFormat(listStatus.status)}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_chapters_read}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_volumes_read}
                </Text>
                <Text style={styles.Value}>
                    # {listStatus.score}
                </Text>
                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    {listStatus.is_rereading == true ? "yes" : "no"}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_times_reread}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.reread_value}
                </Text>

                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    <TimeAgo time={listStatus.updated_at ?? ""} interval={5000} />
                </Text>
            </View>
        );
    }
    mangaEditing(listStatus: UpdateListStatusResultManga) {
        return (
            <View style={styles.Values}>
                <Text style={styles.Value}>
                    {niceTextFormat(listStatus.status)}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_chapters_read}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_volumes_read}
                </Text>
                <Text style={styles.Value}>
                    ## {listStatus.score}
                </Text>
                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    {listStatus.is_rereading == true ? "yes" : "no"}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_times_reread}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.reread_value}
                </Text>

                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    <TimeAgo time={listStatus.updated_at ?? ""} interval={5000} />
                </Text>
            </View>
        );
    }

    renderMangaEditing(listStatus: UpdateListStatusResultManga) {
        return (<View style={styles.Table}>
            <View style={styles.Labels}>
                <Text style={styles.Label}>
                    Status:
                </Text>
                <Text style={styles.Label}>
                    Chapters read:
                </Text>
                <Text style={styles.Label}>
                    Volumes read:
                </Text>
                <Text style={styles.Label}>
                    Score:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Rereading:
                </Text>
                <Text style={styles.Label}>
                    Number of times reread:
                </Text>
                <Text style={styles.Label}>
                    Reread value:
                </Text>

                <Text style={styles.Label}>

                </Text>

                <Text style={styles.Label}>
                    Updated:
                </Text>
            </View>
            <View style={styles.Values}>
                <Text style={styles.Value}>
                    {niceTextFormat(listStatus.status)}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_chapters_read}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_volumes_read}
                </Text>
                <Text style={styles.Value}>
                    # {listStatus.score}
                </Text>
                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    {listStatus.is_rereading == true ? "yes" : "no"}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.num_times_reread}
                </Text>
                <Text style={styles.Value}>
                    {listStatus.reread_value}
                </Text>

                <Text style={styles.Value}>

                </Text>

                <Text style={styles.Value}>
                    <TimeAgo time={listStatus.updated_at ?? ""} interval={5000} />
                </Text>
            </View>
        </View>)
    }


    saveEdit() {
        console.log("save");

        this.refresh();
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
                        {

                            this.state.isAnime ?
                                this.renderAnime(this.state.listStatus as UpdateListStatusResultAnime)
                                : this.renderManga(this.state.listStatus as UpdateListStatusResultManga)
                        }
                        {
                            !this.state.isEditing ?
                                (<TouchableOpacity style={styles.listStatusEdit} onPress={() => {
                                    this.setState({ ...this.state, isEditing: true });
                                }}>
                                    <Text style={{ alignSelf: "center" }}>Edit</Text>
                                </TouchableOpacity>)
                                : <TouchableOpacity style={styles.listStatusEdit} onPress={() => {
                                    this.saveEdit()
                                }}>
                                    <Text style={{ alignSelf: "center" }}>Save</Text>
                                </TouchableOpacity>
                        }

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
    page: {
        margin: 10,
    },
    Labels: {
        flexDirection: "column",
        flex: 1,
        margin: 2
    },
    Values: {
        flexDirection: "column",
        flex: 1,
        margin: 2
    },
    Table: {
        flexDirection: "row",
    },
    Label: {
        color: Colors.TEXT,
        fontWeight: "bold",
        fontSize: fontSize * 1.2,
    },
    Value: {
        color: Colors.TEXT,
        fontSize: fontSize * 1.2,
    },
    listStatusEdit: {
        width: Dimensions.get("window").width - 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.KURABUPINK,
        fontSize: fontSize,
        color: Colors.KURABUPINK,
        marginTop: 10
    }
});
