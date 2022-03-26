import { Colors } from "#config/Colors";
import { niceTextFormat } from "#helpers/textFormatting";
import React from "react";
import { TouchableOpacity, View, Text, Dimensions, StyleSheet } from "react-native";
import { Divider } from "#comps/Divider";
import TimeAgo from "react-native-timeago";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "#routes/MainStacks/HomeStack";
import { AddAnimeToList } from "#actions/anime/AddAnimeToList";
import { AddMangaToList } from "#actions/manga/AddMangaToList";
import { AnimeDetailsMediaTypeEnum, AnimeDetailsMyListStatus, MangaDetailsMediaTypeEnum, MangaDetailsMyListStatus } from "@kurabu/api-sdk";

type Props = {
    navigation: StackNavigationProp<HomeStackParamList, "DetailsScreen">;
    route: RouteProp<HomeStackParamList, "DetailsScreen">;
    props?: AnimeDetailsMyListStatus | MangaDetailsMyListStatus;
    mediaType: AnimeDetailsMediaTypeEnum | MangaDetailsMediaTypeEnum;
    id: number;
    parentRefresh: () => void;
};

type State = {
    isAnime: boolean;
};

export class ListStatus extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        const mangaMediatTypes = [
            "manga",
            "light_novel",
            "manhwa",
            "one_shot",
            "manhua",
            "doujinshi",
            "novel",
        ];

        this.state = {
            isAnime: !mangaMediatTypes.includes(props.mediaType.toString()),
        };
    }

    showListStatus() {
        this.props.navigation.push("ListDetailsScreen", {
            id: this.props.id,
            mediaType: this.props.mediaType,
        });
    }

    async addToList() {
        let success = false;
        let action: AddAnimeToList | AddMangaToList;
        if (this.state.isAnime == true) {
            action = new AddAnimeToList();
        } else {
            action = new AddMangaToList();
        }

        await action.MakeRequest(this.props.id)
        success = true;

        if (success) this.props.parentRefresh();
    }

    renderAnime(props: AnimeDetailsMyListStatus) {
        return (
            <View style={styles.TopAreaData}>
                <View style={styles.TopAreaLabels}>
                    <Text style={styles.TopAreaLabel}>Status:</Text>
                    <Text style={styles.TopAreaLabel}>Watched episodes:</Text>
                    <Text style={styles.TopAreaLabel}>Status updated:</Text>
                </View>
                <View style={styles.TopAreaValues}>
                    <Text style={styles.TopAreaValue}>{niceTextFormat(props.status?.toString())}</Text>
                    <Text style={styles.TopAreaValue}>{props.numEpisodesWatched}</Text>

                    <Text style={styles.TopAreaValue}>
                        <TimeAgo time={props.updatedAt ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>
        );
    }

    renderManga(props: MangaDetailsMyListStatus) {
        return (
            <View style={styles.TopAreaData}>
                <View style={styles.TopAreaLabels}>
                    <Text style={styles.TopAreaLabel}>Status:</Text>
                    <Text style={styles.TopAreaLabel}>Volumes read:</Text>
                    <Text style={styles.TopAreaLabel}>Chapters read:</Text>
                    <Text style={styles.TopAreaLabel}>Status updated:</Text>
                </View>
                <View style={styles.TopAreaValues}>
                    <Text style={styles.TopAreaValue}>{niceTextFormat(props.status?.toString())}</Text>
                    <Text style={styles.TopAreaValue}>{props.numVolumesRead}</Text>
                    <Text style={styles.TopAreaValue}>{props.numChaptersRead}</Text>

                    <Text style={styles.TopAreaValue}>
                        <TimeAgo time={props.updatedAt ?? ""} interval={5000} />
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.props.props === undefined) {
            return (
                <View>
                    <View style={styles.TopAreaData}>
                        <View style={styles.TopAreaLabels}>
                            <Text style={styles.TopAreaLabel}>Status:</Text>
                        </View>
                        <View style={styles.TopAreaValues}>
                            <Text style={styles.TopAreaValue}>
                                {this.state.isAnime
                                    ? niceTextFormat("not-watching")
                                    : niceTextFormat("not-reading")}
                            </Text>
                        </View>
                    </View>
                    <Divider color={Colors.DIVIDER} widthPercentage={0} />
                    {this.showListStatusButton()}
                </View>
            );
        }

        return (
            <View>
                {this.state.isAnime
                    ? this.renderAnime(this.props.props as AnimeDetailsMyListStatus)
                    : this.renderManga(this.props.props as MangaDetailsMyListStatus)}
                <Divider color={Colors.DIVIDER} widthPercentage={0} />
                {this.showListStatusButton()}
            </View>
        );
    }

    showListStatusButton() {
        if (this.props.props == undefined) {
            return (
                <TouchableOpacity
                    style={styles.listStatusEdit}
                    onPress={() => {
                        void this.addToList();
                    }}
                >
                    <Text
                        style={styles.alignSelfCenter}
                    >
                        Add to list
                    </Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.listStatusEdit}
                    onPress={() => {
                        this.showListStatus();
                    }}
                >
                    <Text
                        style={styles.alignSelfCenter}
                    >
                        Details
                    </Text>
                </TouchableOpacity>
            );
        }
    }
}

const fontSize = Dimensions.get("window").width / 36;

const styles = StyleSheet.create({
    alignSelfCenter: {
        alignSelf: "center",
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
        fontSize: fontSize,
    },
    TopAreaValue: {
        color: Colors.TEXT,
        fontSize: fontSize,
    },
    listStatusEdit: {
        width: Dimensions.get("window").width - 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: Colors.KURABUPINK,
        fontSize: fontSize,
        color: Colors.KURABUPINK,
    },
});
