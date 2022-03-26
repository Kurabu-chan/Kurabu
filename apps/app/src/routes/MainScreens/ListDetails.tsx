import { AnimeDetailsSource } from "#data/anime/AnimeDetailsSource";
import { UpdateAnimeList } from "#actions/anime/UpdateAnimeList";
import { MangaDetailsSource } from "#data/manga/MangaDetailsSource";
import { Colors } from "#config/Colors";
import { BackButtonFunctionsType, changeActivePage, changeBackButton, getActivePage } from "#helpers/backButton";
import { ListDetailsStateManager } from "#helpers/Screens/Main/ListDetails/StateManager";
import { niceTextFormat } from "#helpers/textFormatting";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { Picker } from "@react-native-community/picker";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TimeAgo from "react-native-timeago";
import { AnimeDetailsMediaTypeEnum, AnimeDetailsMyListStatus, MangaDetailsMediaTypeEnum, MangaDetailsMyListStatus } from "@kurabu/api-sdk";

export type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "ListDetailsScreen">;
    route: RouteProp<HomeStackParamList, "ListDetailsScreen">;
};

export type State = {
    mediaId: number;
    listStatus?: Partial<AnimeDetailsMyListStatus | MangaDetailsMyListStatus>;
    listenerToUnMount?: () => void;
    page: keyof BackButtonFunctionsType;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
    isAnime: boolean;
    isEditing: boolean;
    before?: Partial<AnimeDetailsMyListStatus | MangaDetailsMyListStatus>;
};

export class ListDetails extends React.PureComponent<Props, State> {
    private stateManager: ListDetailsStateManager;
    constructor(props: Props) {
        super(props);
        this.stateManager = new ListDetailsStateManager(this);

        let mediaId = props.route.params.id;
        const mediaType = props.route.params.mediaType;
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
        const isAnime = !mangaMediatTypes.includes(mediaType.toString());
        this.state = {
            mediaId: mediaId,
            listenerToUnMount: undefined,
            page: getActivePage(),
            mediaType: mediaType,
            isAnime: isAnime,
            isEditing: false,
        };

        void this.refresh();
    }

    async refresh() {
        const animeFields = "id, title, main_picture, alternative_titles, my_list_status{status, comments, is_rewatching, num_times_rewatched, num_watched_episodes, priority, rewatch_value, score, tags}";
        const mangaFields = "id, title, main_picture, alternative_titles, my_list_status{status, score, num_volumes_read, num_chapters_read, is_rereading, updated_at, priority, num_times_reread, reread_value, tags, comments}";

        let listSource: AnimeDetailsSource | MangaDetailsSource;

        if (!this.state.isAnime) {
            listSource = new MangaDetailsSource(this.state.mediaId, mangaFields);
        } else {
            listSource = new AnimeDetailsSource(this.state.mediaId, animeFields);
        }

        const listStatus = await listSource.MakeRequest();

        this.setState({
            mediaId: this.state.mediaId,
            listStatus: listStatus.myListStatus,
            isEditing: false,
            before: listStatus.myListStatus,
        });
    }

    componentDidMount() {
        changeBackButton(this.state.page, () => {
            this.props.navigation.popToTop();
            changeBackButton(this.state.page, undefined);
        });

        const unsubscribe = this.props.navigation.addListener("focus", () => {
            changeActivePage(this.state.page);
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

    renderAnime(listStatus: AnimeDetailsMyListStatus) {
        if (this.state.isEditing) return this.animeEditing(listStatus);
        else return this.animeDisplay(listStatus);
    }

    renderManga(listStatus: MangaDetailsMyListStatus) {
        if (this.state.isEditing) return this.mangaEditing(listStatus);
        else return this.mangaDisplay(listStatus);
    }

    animeDisplay(listStatus: AnimeDetailsMyListStatus) {
        return (
            <View style={styles.Table}>
                <View style={styles.Labels}>
                    <Text style={styles.Label}>Status:</Text>
                    <Text style={styles.Label}>Watched episodes:</Text>
                    <Text style={styles.Label}>Score:</Text>
                    <Text style={styles.Label}>Priority:</Text>

                    <Text style={styles.Label}></Text>

                    <Text style={styles.Label}>Rewatching:</Text>
                    <Text style={styles.Label}>Num times rewatched:</Text>
                    <Text style={styles.Label}>Rewatch value:</Text>

                    <Text style={styles.Label}></Text>

                    <Text style={styles.Label}>Tags:</Text>
                    <Text style={styles.Label}>Comments:</Text>

                    <Text style={styles.Label}></Text>

                    <Text style={styles.Label}>Updated:</Text>
                </View>
                <View style={styles.Values}>
                    <Text style={styles.Value}>{niceTextFormat(listStatus.status?.toString())}</Text>
                    <Text style={styles.Value}>{listStatus.numEpisodesWatched}</Text>
                    <Text style={styles.Value}># {listStatus.score}</Text>
                    <Text style={styles.Value}>{listStatus.priority}</Text>

                    <Text style={styles.Value}></Text>

                    <Text style={styles.Value}>
                        {listStatus.isRewatching == true ? "yes" : "no"}
                    </Text>
                    <Text style={styles.Value}>{listStatus.numTimesRewatched}</Text>
                    <Text style={styles.Value}>{listStatus.rewatchValue}</Text>

                    <Text style={styles.Value}></Text>

                    <Text style={styles.Value}>
                        {listStatus.tags == undefined || listStatus.tags.length == 0
                            ? "N/A"
                            : listStatus.tags.join(", ")}
                    </Text>
                    <Text style={styles.Value}>
                        {(listStatus.comments ?? "") == "" ? "N/A" : listStatus.comments}
                    </Text>

                    <Text style={styles.Value}></Text>

                    <Text style={styles.Value}>
                        <TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>
        );
    }

    animeEditing(listStatus: AnimeDetailsMyListStatus) {
        return (
            <View style={styles.newTable}>
                <View style={styles.newPair}></View>
                {/* for some crazy reason 2 empty ones are required for the first 2 to show up */}
                <View style={styles.newPair}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Status:</Text>
                    <Picker
                        selectedValue={listStatus.status}
                        style={styles.newValue}
                        onValueChange={this.stateManager.changeStatus.bind(this)}
                    >
                        <Picker.Item label={niceTextFormat("watching")} value="watching" />
                        <Picker.Item label={niceTextFormat("completed")} value="completed" />
                        <Picker.Item label={niceTextFormat("on_hold")} value="on_hold" />
                        <Picker.Item label={niceTextFormat("dropped")} value="dropped" />
                        <Picker.Item
                            label={niceTextFormat("plan_to_watch")}
                            value="plan_to_watch"
                        />
                    </Picker>
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Watched episodes:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.numEpisodesWatched?.toString() ?? ""}
                        onChangeText={this.stateManager.changeEpisodesWatched.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Score:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.score?.toString() ?? ""}
                        onChangeText={this.stateManager.changeScore.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Priority:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.priority?.toString() ?? ""}
                        onChangeText={this.stateManager.changePriority.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>

                <View style={styles.empty}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Rewatching:</Text>
                    <Picker
                        selectedValue={listStatus.isRewatching == true ? "true" : "false"}
                        style={styles.newValue}
                        onValueChange={this.stateManager.changeIsRewatching.bind(this)}
                    >
                        <Picker.Item label={niceTextFormat("yes")} value="true" />
                        <Picker.Item label={niceTextFormat("no")} value="false" />
                    </Picker>
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Num times rewatched:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.numTimesRewatched?.toString() ?? ""}
                        onChangeText={this.stateManager.changeNumTimesRewatched.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Rewatch value:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.rewatchValue?.toString() ?? ""}
                        onChangeText={this.stateManager.changeRewatchValue.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>

                <View style={styles.empty}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Tags:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.tags?.join(" ") ?? ""}
                        onChangeText={this.stateManager.changeTags.bind(this)}
                        keyboardType={"ascii-capable"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Comments:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.comments ?? ""}
                        onChangeText={this.stateManager.changeComments.bind(this)}
                        keyboardType={"ascii-capable"}
                    />
                </View>

                <View style={styles.empty}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Updated:</Text>
                    <Text style={styles.newValue}>
                        <TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>
        );
    }

    mangaDisplay(listStatus: MangaDetailsMyListStatus) {
        return (
            <View style={styles.Table}>
                <View style={styles.Labels}>
                    <Text style={styles.Label}>Status:</Text>
                    <Text style={styles.Label}>Chapters read:</Text>
                    <Text style={styles.Label}>Volumes read:</Text>
                    <Text style={styles.Label}>Score:</Text>

                    <Text style={styles.Label}></Text>

                    <Text style={styles.Label}>Rereading:</Text>
                    <Text style={styles.Label}>Number of times reread:</Text>
                    <Text style={styles.Label}>Reread value:</Text>

                    <Text style={styles.Label}></Text>

                    <Text style={styles.Label}>Tags:</Text>
                    <Text style={styles.Label}>Comments:</Text>

                    <Text style={styles.Label}></Text>

                    <Text style={styles.Label}>Updated:</Text>
                </View>
                <View style={styles.Values}>
                    <Text style={styles.Value}>{niceTextFormat(listStatus.status?.toString())}</Text>
                    <Text style={styles.Value}>{listStatus.numChaptersRead}</Text>
                    <Text style={styles.Value}>{listStatus.numVolumesRead}</Text>
                    <Text style={styles.Value}># {listStatus.score}</Text>

                    <Text style={styles.Value}></Text>

                    <Text style={styles.Value}>
                        {listStatus.isRereading == true ? "yes" : "no"}
                    </Text>
                    <Text style={styles.Value}>{listStatus.numTimesReread}</Text>
                    <Text style={styles.Value}>{listStatus.rereadValue}</Text>

                    <Text style={styles.Value}></Text>

                    <Text style={styles.Value}>
                        {listStatus.tags == undefined || listStatus.tags.length == 0
                            ? "N/A"
                            : listStatus.tags.join(", ")}
                    </Text>
                    <Text style={styles.Value}>
                        {(listStatus.comments ?? "") == "" ? "N/A" : listStatus.comments}
                    </Text>

                    <Text style={styles.Value}></Text>

                    <Text style={styles.Value}>
                        <TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>
        );
    }
    mangaEditing(listStatus: MangaDetailsMyListStatus) {
        if (this.state.listStatus == undefined) return;
        return (
            <View style={styles.newTable}>
                <View style={styles.newPair}></View>
                {/* for some crazy reason 2 empty ones are required for the first 2 to show up */}
                <View style={styles.newPair}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Status:</Text>
                    <Picker
                        selectedValue={listStatus.status}
                        style={styles.newValue}
                        onValueChange={this.stateManager.changeStatus.bind(this)}
                    >
                        <Picker.Item label={niceTextFormat("reading")} value="reading" />
                        <Picker.Item label={niceTextFormat("completed")} value="completed" />
                        <Picker.Item label={niceTextFormat("on_hold")} value="on_hold" />
                        <Picker.Item label={niceTextFormat("dropped")} value="dropped" />
                        <Picker.Item label={niceTextFormat("plan_to_read")} value="plan_to_read" />
                    </Picker>
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Chapters read:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.numChaptersRead?.toString() ?? ""}
                        onChangeText={this.stateManager.changeChaptersRead.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Volumes read:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.numChaptersRead?.toString() ?? ""}
                        onChangeText={this.stateManager.changeVolumesRead.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Score:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.score?.toString() ?? ""}
                        onChangeText={this.stateManager.changeScore.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Priority:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.priority?.toString() ?? ""}
                        onChangeText={this.stateManager.changePriority.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>

                <View style={styles.empty}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Rereading:</Text>
                    <Picker
                        selectedValue={listStatus.isRereading == true ? "true" : "false"}
                        style={styles.newValue}
                        onValueChange={this.stateManager.changeIsRereading.bind(this)}
                    >
                        <Picker.Item label={niceTextFormat("yes")} value="true" />
                        <Picker.Item label={niceTextFormat("no")} value="false" />
                    </Picker>
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Num times rewatched:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.numTimesReread?.toString() ?? ""}
                        onChangeText={this.stateManager.changeNumTimesReread.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Rewatch value:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.rereadValue?.toString() ?? ""}
                        onChangeText={this.stateManager.changeRereadValue.bind(this)}
                        keyboardType={"numeric"}
                    />
                </View>

                <View style={styles.empty}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Tags:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.tags?.join(" ") ?? ""}
                        onChangeText={this.stateManager.changeTags.bind(this)}
                        keyboardType={"ascii-capable"}
                    />
                </View>
                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Comments:</Text>
                    <TextInput
                        style={styles.newValue}
                        value={listStatus.comments ?? ""}
                        onChangeText={this.stateManager.changeComments.bind(this)}
                        keyboardType={"ascii-capable"}
                    />
                </View>

                <View style={styles.empty}></View>

                <View style={styles.newPair}>
                    <Text style={styles.newLabel}>Updated:</Text>
                    <Text style={styles.newValue}>
                        <TimeAgo time={listStatus.updatedAt ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>
        );
    }

    async saveEdit() {
        if (this.state.listStatus == undefined) return;

        if (this.state.isAnime == true) {
            const updateRequest = new UpdateAnimeList();
            await updateRequest.MakeRequest(
                this.state.mediaId,
                this.state.before as AnimeDetailsMyListStatus,
                this.state.listStatus as AnimeDetailsMyListStatus
            )
            await this.refresh();
        } else {
            const updateRequest = new UpdateAnimeList();
            await updateRequest.MakeRequest(
                this.state.mediaId,
                this.state.before as AnimeDetailsMyListStatus,
                this.state.listStatus as AnimeDetailsMyListStatus
            )
            await this.refresh();
        }
    }

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
                    style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    }}
                >
                    {this.state.listStatus == undefined ? (
                        <ActivityIndicator
                            style={styles.loading}
                            size="large"
                            color={Colors.BLUE}
                        />
                    ) : (
                        <ScrollView style={styles.page}>
                            {this.state.isAnime
                                ? this.renderAnime(
                                      this.state.listStatus as AnimeDetailsMyListStatus
                                  )
                                : this.renderManga(
                                      this.state.listStatus as MangaDetailsMyListStatus
                                  )}
                            {!this.state.isEditing ? (
                                <TouchableOpacity
                                    style={styles.listStatusEdit}
                                    onPress={() => {
                                        this.setState({
                                            ...this.state,
                                            isEditing: true,
                                        });
                                    }}
                                >
                                    <Text
                                        style={styles.selfAlignCenter}
                                    >
                                        Edit
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.listStatusEdit}
                                    onPress={async () => {
                                        await this.saveEdit();
                                    }}
                                >
                                    <Text
                                        style={styles.selfAlignCenter}
                                    >
                                        Save
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {this.state.isEditing == true ? (
                                <TouchableOpacity
                                    style={styles.listStatusEdit}
                                    onPress={async () => {
                                        await this.refresh();
                                    }}
                                >
                                    <Text
                                        style={styles.selfAlignCenter}
                                    >
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            ) : undefined}
                        </ScrollView>
                    )}
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

const fontSize = Dimensions.get("window").width / 36;

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
        margin: 2,
    },
    Values: {
        flexDirection: "column",
        flex: 1,
        margin: 2,
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
        marginTop: 10,
    },
    newLabel: {
        flex: 1,
        fontWeight: "bold",
        color: Colors.TEXT,
        fontSize: fontSize * 1.2,
        textAlignVertical: "center",
    },
    newValue: {
        flex: 1,
        color: Colors.TEXT,
        fontSize: fontSize * 1.2,
    },
    newPair: {
        flexDirection: "row",
        flex: 1,
        margin: 2,
    },
    empty: {
        flexDirection: "row",
        flex: 1,
        margin: 6,
    },
    newTable: {
        flexDirection: "column",
    },
    selfAlignCenter: {
        alignSelf: "center",
    }
});
