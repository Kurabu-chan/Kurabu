import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NoImageKurabu from "../../assets/NoImageKurabu.svg";
import { Colors } from "#config/Colors";
import { Divider } from "./Divider";
import { MediaFields, AnimeDetails, MangaDetails, AnimeListData, MangaListData } from "@kurabu/api-sdk";
import { fieldsToString } from "#helpers/fieldsHelper";
import { niceDateFormat, niceTextFormat } from "#helpers/textFormatting";
import { Progress } from "./MediaListStatusProgressBar";

type DetailedUpdateItemProps = {
    item: AnimeListData | MangaListData;
    navigator: StackNavigationProp<any, any>;
    showListStatus?: boolean;
};

type DetailedUpdateItemState = {
    item: AnimeListData | MangaListData;
    navigator: StackNavigationProp<any, any>;
};
// Add manga fields
export const DetailedUpdateItemFields: MediaFields[] = [
    MediaFields.Id,
    MediaFields.Genres,
    MediaFields.MainPicture,
    MediaFields.Title,
    MediaFields.Mean,
    MediaFields.Rank,
    MediaFields.Popularity,
    MediaFields.NumEpisodes,
    MediaFields.NumVolumes,
    MediaFields.NumChapters,
    MediaFields.Status,
    MediaFields.StartDate,
    MediaFields.MediaType
];
const animeListStatus: string = "my_list_status{status, comments, is_rewatching, num_times_rewatched, num_watched_episodes, priority, rewatch_value, score, tags}";
const mangaListStatus: string = "my_list_status{status, score, num_volumes_read, num_chapters_read, is_rereading, updated_at, priority, num_times_reread, reread_value, tags, comments}";

export const AnimeExpandedDetailedUpdateItemFields: string = `${fieldsToString(DetailedUpdateItemFields)}, ${animeListStatus}`;
export const MangaExpandedDetailedUpdateItemFields: string = `${fieldsToString(DetailedUpdateItemFields)}, ${mangaListStatus}`;

export class DetailedUpdateItem extends React.PureComponent<
    DetailedUpdateItemProps,
    DetailedUpdateItemState
> {
    constructor(props: DetailedUpdateItemProps) {
        super(props);
        let item = props.item;
        if (item == undefined) {
            item = {
                node: {
                    id: 1,
                    title: "failure",
                    mainPicture: {
                        medium: "https://image.shutterstock.com/image-photo/portrait-surprised-cat-scottish-straight-260nw-499196506.jpg",
                        large: "https://image.shutterstock.com/image-photo/portrait-surprised-cat-scottish-straight-260nw-499196506.jpg",
                    },
                },
            };
        }

        this.state = {
            item: item,
            navigator: props.navigator,
        };
    }

    public openDetails() {
        this.state.navigator.push("DetailsScreen", {
            id: this.state.item.node.id,
            mediaType: this.state.item.node.mediaType,
        });
    }

    NiceString(text: string | undefined) {
        if (text == undefined) return "";
        text = text.replace(/_/g, " ");
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    getMangaNode(): MangaDetails | undefined {
        if ("numEpisodes" in this.state.item.node) {
            return undefined;
        }

        return this.state.item.node as MangaDetails;
    }

    getAnimeNode(): AnimeDetails | undefined {
        if ("numChapters" in this.state.item.node) {
            return undefined;
        }

        return this.state.item.node as AnimeDetails;
    }

    createListStatus() {
        if (this.props.showListStatus !== true) return;

        const animeNode = this.getAnimeNode();
        const mangaNode = this.getMangaNode();

        if (animeNode?.myListStatus !== undefined) {
            return this.createAnimeListStatus(animeNode);
        }
        if (mangaNode?.myListStatus !== undefined) {
            return this.createMangaListStatus(mangaNode);
        }
        return undefined;        
    }

    createMangaListStatus(node: MangaDetails) {
        return (
            <View style={styles.listContainer}>
                <Divider margin={ false } color={Colors.DIVIDER} widthPercentage={100} />
                <View style={TopArea.Data}>
                    <View style={TopArea.TopLeftLabels}>
                        <Text style={TopArea.Label}>List status:</Text>
                    </View>
                    <View style={TopArea.TopLeftValues}>
                        <Text style={TopArea.Value}>
                            {niceTextFormat(node?.myListStatus?.status)}
                        </Text>
                    </View>
                    <View style={TopArea.TopLeftLabels}>
                        <Text style={TopArea.Label}>Last updated:</Text>
                    </View>
                    <View style={TopArea.TopLeftValues}>
                        <Text style={TopArea.Value}>
                            {niceDateFormat(node?.myListStatus?.updatedAt)}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={TopArea.Data}>
                        <View style={{ ...TopArea.Labels, flex: 1.5 }}>
                            <Text style={{...TopArea.Label, marginBottom: 3, marginTop: 3}}>Chapter progress:</Text>
                            <Text style={{ ...TopArea.Label, marginTop: 8 }}>Volume progress:</Text>
                        </View>
                        <View style={TopArea.Values}>
                            <View style={{ marginBottom: 3, marginTop: 3}}>
                                <Progress fullList={this.state.item.node.myListStatus ?? {}} fieldToControl="numChaptersRead" mediaId={node.id} color={Colors.KURABUPINK} height={25} min={0} max={node.numChapters ?? 0} current={node.myListStatus?.numChaptersRead ?? 0} />
                            </View>
                            <Progress fullList={this.state.item.node.myListStatus ?? {}} fieldToControl="numVolumesRead" mediaId={node.id} color={Colors.KURABUPINK} height={25} min={0} max={node.numVolumes ?? 0} current={node.myListStatus?.numVolumesRead ?? 0} />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    createAnimeListStatus(node: AnimeDetails) {
        return (
            <View style={styles.listContainer}>
                <Divider margin={ false} color={Colors.DIVIDER} widthPercentage={100} />
                <View style={TopArea.Data}>
                    <View style={TopArea.TopLeftLabels}>
                        <Text style={TopArea.Label}>List status:</Text>
                    </View>
                    <View style={TopArea.TopLeftValues}>
                        <Text style={TopArea.Value}>
                            {niceTextFormat(node?.myListStatus?.status)}
                        </Text>
                    </View>
                    <View style={TopArea.TopLeftLabels}>
                        <Text style={TopArea.Label}>Last updated:</Text>
                    </View>
                    <View style={TopArea.TopLeftValues}>
                        <Text style={TopArea.Value}>
                            {niceDateFormat(node?.myListStatus?.updatedAt)}
                        </Text>
                    </View>
                </View>
                <View>
                    <View style={TopArea.Data}>
                        <View style={{ ...TopArea.Labels, flex: 1.5 }}>
                            <Text style={{ ...TopArea.Label, marginBottom: 3, marginTop: 3 }}>Episode progress:</Text>
                        </View>
                        <View style={TopArea.Values}>
                            <View style={{ marginBottom: 3, marginTop: 3}}>
                                <Progress fullList={this.state.item.node.myListStatus ?? {}} fieldToControl="numEpisodesWatched" mediaId={node.id} color={Colors.KURABUPINK} height={25} min={0} max={node.numEpisodes ?? 0} current={node.myListStatus?.numEpisodesWatched ?? 0} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const manga = this.getMangaNode();
        const anime = this.getAnimeNode();

        const listStatusElement = this.createListStatus();

        return (
            <View style={styles.mediaContainer} >
                <TouchableOpacity style={styles.mainContainer} onPress={this.openDetails.bind(this)}>
                    {this.state.item.node.mainPicture !== undefined ? (
                        <Image
                            style={styles.image}
                            source={{
                                uri: this.state.item.node.mainPicture.medium,
                            }}
                        />
                    ) : (
                        <View style={styles.image}>
                            <NoImageKurabu style={styles.image} />
                        </View>
                    )}
                    <View style={styles.TitleArea}>
                        <Text style={styles.title}>{this.state.item.node.title}</Text>
                        <Divider color={Colors.DIVIDER} widthPercentage={100} />
                        <View style={TopArea.Data}>
                            <View style={TopArea.TopLeftLabels}>
                                <Text style={TopArea.Label}>Score:</Text>
                                <Text style={TopArea.Label}>Rank:</Text>
                            </View>
                            <View style={TopArea.TopLeftValues}>
                                <Text style={TopArea.Value}>{this.state.item.node.mean ?? "NA"}</Text>
                                <Text style={TopArea.Value}>
                                    {this.state.item.node.rank ? "#" + this.state.item.node.rank : "NA"}
                                </Text>
                            </View>
                            <View style={TopArea.TopRightLabels}>
                                {anime === undefined ? undefined : <Text style={TopArea.Label}>Episodes:</Text>}
                                {manga === undefined ? undefined : (<View>
                                    <Text style={TopArea.Label}>Chapters:</Text>
                                    <Text style={TopArea.Label}>Volumes:</Text>
                                </View>)}
                                <Text style={TopArea.Label}>Popularity:</Text>
                            </View>
                            <View style={TopArea.TopRightValues}>
                                {anime === undefined ? undefined : (
                                    <Text style={TopArea.Value}>
                                        {anime.numEpisodes == 0
                                            ? "N/A"
                                            : anime.numEpisodes}
                                    </Text>
                                )}
                                {manga === undefined ? undefined : (<View>
                                    <Text style={TopArea.Value}>{manga.numChapters == 0
                                        ? "N/A"
                                        : manga.numChapters}</Text>
                                    <Text style={TopArea.Value}>{manga.numVolumes == 0
                                        ? "N/A"
                                        : manga.numVolumes}</Text>
                                </View>)}

                                <Text style={TopArea.Value}>#{this.state.item.node.popularity}</Text>
                            </View>
                        </View>
                        <Divider color={Colors.DIVIDER} widthPercentage={100} />
                        <View style={TopArea.Data}>
                            <View style={TopArea.Labels}>
                                <Text style={TopArea.Label}>Aired:</Text>
                                <Text style={TopArea.Label}>Status:</Text>
                            </View>
                            <View style={TopArea.Values}>
                                <Text style={TopArea.Value}>{dateOnly(this.state.item.node.startDate)}</Text>
                                <Text style={TopArea.Value}>
                                    {this.NiceString(this.state.item.node.status?.toString())}
                                </Text>
                            </View>
                        </View>
                        <Divider color={Colors.DIVIDER} widthPercentage={100} />
                        <View style={TopArea.Data}>
                            <View style={TopArea.Labels}>
                                <Text style={TopArea.Label}>Genres:</Text>
                            </View>
                            <View style={TopArea.Values}>
                                <Text style={TopArea.Value}>
                                    {this.state.item.node.genres?.map((x) => x.name).join(", ")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                
                {listStatusElement}
                
            </View>
        );
    }
}

var fontSize = Dimensions.get("window").width / 36;

const TopArea = StyleSheet.create({
    Data: {
        flexDirection: "row",
    },
    Labels: {
        flexDirection: "column",
        flex: 1,
        marginLeft: 5,
    },
    Label: {
        color: Colors.TEXT,
        fontWeight: "bold",
        fontSize: fontSize,
    },
    Values: {
        flexDirection: "column",
        flex: 3.5,
    },
    Value: {
        color: Colors.TEXT,
        fontSize: fontSize,
    },

    TopLeftLabels: {
        flexDirection: "column",
        flex: 1,
        marginLeft: 5,
    },
    TopLeftValues: {
        flexDirection: "column",
        flex: 1,
    },
    TopRightLabels: {
        flexDirection: "column",
        flex: 1.5,
        marginLeft: 5,
    },
    TopRightValues: {
        flexDirection: "column",
        flex: 1,
    },
});

const styles = StyleSheet.create({
    page: {
        margin: 10,
    },
    mediaContainer: {
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: Colors.KURABUPURPLE,
        marginBottom: 5,
        marginLeft: 0,
        marginRight: 5,
        flexDirection: "column"
    },
    mainContainer: {
        width: Dimensions.get("window").width - 5,
        height: (Dimensions.get("window").width / 3) * 1.5,
        flexDirection: "row",
    },
    listContainer: {
        padding: 5,
        paddingTop: 0
    },
    title: {
        fontSize: fontSize * 1.2,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.TEXT,
    },
    TitleArea: {
        flexDirection: "column",
        flex: 1,
        padding: 5,
    },
    image: {
        width: Dimensions.get("window").width / 3,
        height: (Dimensions.get("window").width / 3) * 1.5,
    }    
});

function dateOnly(date: Date | undefined) {
    if (date === undefined) return undefined;

    return `${padWithZero(date.getDate())}-${padWithZero(date.getMonth() + 1)}-${date.getFullYear()}`
}

function padWithZero(num: number) {
    const str = num.toString();

    if (str.length == 2) return str;

    return "0" + str;
}

export default DetailedUpdateItem;
