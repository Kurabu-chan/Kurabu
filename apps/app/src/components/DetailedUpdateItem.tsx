import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import NoImageKurabu from "../../assets/NoImageKurabu.svg";
import { Divider } from "./themed/Divider";
import { MediaFields, AnimeDetails, MangaDetails, AnimeListData, MangaListData } from "@kurabu/api-sdk";
import { fieldsToString } from "#helpers/fieldsHelper";
import { niceDateFormat, niceTextFormat } from "#helpers/textFormatting";
import { Progress } from "./MediaListStatusProgressBar";
import { ParamListBase } from "@react-navigation/native";
import { AppliedStyles, colors, sizing, ThemedComponent, mergeStyles, resolve, ProvidedTheme } from "@kurabu/theme";
import { ThemedStyleSheet } from "#helpers/ThemedStyleSheet";
import { Typography } from "./themed/Typography";

type DetailedUpdateItemProps = {
    item: AnimeListData | MangaListData;
    navigator: StackNavigationProp<ParamListBase, string>;
    showListStatus?: boolean;
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
const animeListStatus = "my_list_status{status, comments, is_rewatching, num_times_rewatched, num_watched_episodes, priority, rewatch_value, score, tags}";
const mangaListStatus = "my_list_status{status, score, num_volumes_read, num_chapters_read, is_rereading, updated_at, priority, num_times_reread, reread_value, tags, comments}";

export const AnimeExpandedDetailedUpdateItemFields = `${fieldsToString(DetailedUpdateItemFields)}, ${animeListStatus}`;
export const MangaExpandedDetailedUpdateItemFields = `${fieldsToString(DetailedUpdateItemFields)}, ${mangaListStatus}`;

export class DetailedUpdateItem extends ThemedComponent<
    Styles,
    DetailedUpdateItemProps
> {
    constructor(props: DetailedUpdateItemProps) {
        super(style, props);
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
        this.props.navigator.push("DetailsScreen", {
            id: this.props.item.node.id,
            mediaType: this.props.item.node.mediaType,
        });
    }

    NiceString(text: string | undefined) {
        if (text == undefined) return "";
        text = text.replace(/_/g, " ");
        return text.slice(0, 1).toUpperCase() + text.slice(1, text.length);
    }

    getMangaNode(): MangaDetails | undefined {
        if ("numEpisodes" in this.props.item.node) {
            return undefined;
        }

        return this.props.item.node as MangaDetails;
    }

    getAnimeNode(): AnimeDetails | undefined {
        if ("numChapters" in this.props.item.node) {
            return undefined;
        }

        return this.props.item.node as AnimeDetails;
    }

    createListStatus(styles: AppliedStyles<Styles>, theme: ProvidedTheme) {
        if (this.props.showListStatus !== true) return;

        const animeNode = this.getAnimeNode();
        const mangaNode = this.getMangaNode();

        if (animeNode?.myListStatus !== undefined) {
            return this.createAnimeListStatus(animeNode, styles, theme);
        }
        if (mangaNode?.myListStatus !== undefined) {
            return this.createMangaListStatus(mangaNode, styles, theme);
        }
        return undefined;
    }

    createMangaListStatus(node: MangaDetails, styles: AppliedStyles<Styles>, theme: ProvidedTheme) {
        return (
            <View style={styles.listContainer}>
                <Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={100} />
                <View style={styles.dataSection}>
                    <View style={styles.sideBySideLabels}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                            List status:
                        </Typography>
                    </View>
                    <View style={styles.sideBySideValues}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                            {niceTextFormat(node?.myListStatus?.status)}
                        </Typography>

                    </View>
                    <View style={styles.sideBySideLabels}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                            Last updated:
                        </Typography>
                    </View>
                    <View style={styles.sideBySideValues}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                            {niceDateFormat(node?.myListStatus?.updatedAt)}
                        </Typography>
                    </View>
                </View>
                <View>
                    <View style={styles.dataSection}>
                        <View style={mergeStyles(styles, ["labelsSection", "progressLabel"]) as StyleProp<ViewStyle>}>
                            <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6" style={styles.progressContainer[1]}>
                                Chapter progress:
                            </Typography>
                            <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6" style={styles.additionalProgressLabel[1]}>
                                Volume progress:
                            </Typography>
                        </View>
                        <View style={styles.valuesSection}>
                            <View style={styles.progressContainer}>
                                <Progress
                                    fullList={this.props.item.node.myListStatus ?? {}}
                                    fieldToControl="numChaptersRead" mediaId={node.id}
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    color={resolve(colors.color("primary"), theme)}
                                    height={25}
                                    min={0}
                                    max={node.numChapters ?? 0}
                                    current={node.myListStatus?.numChaptersRead ?? 0}
                                />
                            </View>
                            <Progress
                                fullList={this.props.item.node.myListStatus ?? {}}
                                fieldToControl="numVolumesRead"
                                mediaId={node.id}
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                color={resolve(colors.color("primary"), theme)}
                                height={25}
                                min={0}
                                max={node.numVolumes ?? 0}
                                current={node.myListStatus?.numVolumesRead ?? 0}
                            />
                        </View>
                    </View>
                </View>
            </View >
        );
    }

    createAnimeListStatus(node: AnimeDetails, styles: AppliedStyles<Styles>, theme: ProvidedTheme) {
        return (
            <View style={styles.listContainer}>
                <Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={100} />
                <View style={styles.dataSection}>
                    <View style={styles.sideBySideLabels}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                            List status:
                        </Typography>
                    </View>
                    <View style={styles.sideBySideValues}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                            {niceTextFormat(node?.myListStatus?.status)}
                        </Typography>
                    </View>
                    <View style={styles.sideBySideLabels}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                            Last updated:
                        </Typography>
                    </View>
                    <View style={styles.sideBySideValues}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                            {niceDateFormat(node?.myListStatus?.updatedAt)}
                        </Typography>
                    </View>
                </View>
                <View>
                    <View style={styles.dataSection}>
                        <View style={mergeStyles(styles, ["labelsSection", "progressLabel"]) as StyleProp<ViewStyle>}>
                            <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6" style={styles.progressContainer[1]}>
                                Episode progress:
                            </Typography>
                        </View>
                        <View style={styles.valuesSection}>
                            <View style={styles.progressContainer}>
                                <Progress
                                    fullList={this.props.item.node.myListStatus ?? {}}
                                    fieldToControl="numEpisodesWatched"
                                    mediaId={node.id}
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    color={resolve(colors.color("primary"), theme)}
                                    height={25}
                                    min={0}
                                    max={node.numEpisodes ?? 0}
                                    current={node.myListStatus?.numEpisodesWatched ?? 0}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderThemed(styles: AppliedStyles<Styles>, theme: ProvidedTheme) {
        const manga = this.getMangaNode();
        const anime = this.getAnimeNode();

        const listStatusElement = this.createListStatus(styles, theme);

        return (
            <View style={styles.container} >
                <TouchableOpacity style={styles.mainContainer} onPress={this.openDetails.bind(this)}>
                    {this.props.item.node.mainPicture !== undefined ? (
                        <Image
                            style={styles.image[1]}
                            source={{
                                uri: this.props.item.node.mainPicture.medium,
                            }}
                        />
                    ) : (
                        <View style={styles.image}>
                            <NoImageKurabu style={styles.image[1]} />
                        </View>
                    )}
                    <View style={styles.titleArea}>
                        <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline5" style={styles.title[1]}>
                            {this.props.item.node.title}
                        </Typography>
                        <Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={100} />
                        <View style={styles.dataSection}>
                            <View style={styles.sideBySideLabels}>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Score:
                                </Typography>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Rank:
                                </Typography>
                            </View>
                            <View style={styles.sideBySideValues}>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                    {this.props.item.node.mean ?? "NA"}
                                </Typography>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                    {this.props.item.node.rank ? `#${this.props.item.node.rank}` : "NA"}
                                </Typography>
                            </View>
                            <View style={styles.sideBySideLabels}>
                                {anime === undefined ? undefined : <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Episodes:
                                </Typography>}
                                {manga === undefined ? undefined : (<View>
                                    <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                        Chapters:
                                    </Typography>
                                    <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                        Volumes:
                                    </Typography>
                                </View>)}
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Popularity:
                                </Typography>
                            </View>
                            <View style={styles.sideBySideValues}>
                                {anime === undefined ? undefined : (
                                    <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                        {anime.numEpisodes == 0
                                            ? "N/A"
                                            : anime.numEpisodes}
                                    </Typography>
                                )}
                                {manga === undefined ? undefined : (<View>
                                    <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                        {manga.numChapters == 0
                                            ? "N/A"
                                            : manga.numChapters}
                                    </Typography>
                                    <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                        {manga.numVolumes == 0
                                            ? "N/A"
                                            : manga.numVolumes}
                                    </Typography>
                                </View>)}

                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                    #{this.props.item.node.popularity}
                                </Typography>
                            </View>
                        </View>
                        <Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={100} />
                        <View style={styles.dataSection}>
                            <View style={styles.labelsSection}>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Aired:
                                </Typography>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Status:
                                </Typography>
                            </View>
                            <View style={styles.valuesSection}>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                    {dateOnly(this.props.item.node.startDate)}
                                </Typography>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                    {this.NiceString(this.props.item.node.status?.toString())}
                                </Typography>
                            </View>
                        </View>
                        <Divider margin={false} variant="secondary" isOnContainer={false} widthPercentage={100} />
                        <View style={styles.dataSection}>
                            <View style={styles.labelsSection}>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="headline6">
                                    Genres:
                                </Typography>
                            </View>

                            <View style={styles.valuesSection}>
                                <Typography colorVariant="secondary" isOnContainer={false} textKind="paragraph" variant="body2">
                                    {this.props.item.node.genres?.map((x) => x.name).join(", ")}
                                </Typography>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {listStatusElement}

            </View>
        );
    }
}


type Styles = typeof style;
const style = ThemedStyleSheet.create({
    additionalProgressLabel: {
        marginTop: sizing.spacing("medium"),
    },
    container: {
        borderBottomRightRadius: sizing.rounding<number>("large"),
        borderTopRightRadius: sizing.rounding<number>("large"),
        backgroundColor: colors.color("secondary"),
        marginBottom: sizing.spacing("small"),
        marginLeft: 0,
        marginRight: sizing.spacing("small"),
        flexDirection: "column"
    },
    dataSection: {
        flexDirection: "row",
    },
    image: {
        width: sizing.vw(33),
        height: sizing.vw(50),
    },
    labelsSection: {
        flexDirection: "column",
        flex: 1,
        marginLeft: sizing.spacing("small"),
    },
    listContainer: {
        padding: sizing.spacing("small"),
        paddingTop: 0
    },
    mainContainer: {
        width: sizing.vw(100, -5),
        flexDirection: "row",
    },
    progressLabel: {
        flex: 1.5
    },
    progressContainer: {
        marginBottom: sizing.spacing("halfSmall"),
        marginTop: sizing.spacing("halfSmall"),
    },
    title: {
        textAlign: "center",
    },
    titleArea: {
        flexDirection: "column",
        flex: 1,
        padding: sizing.spacing("small"),
    },
    sideBySideLabels: {
        flexDirection: "column",
        flex: 1.5,
        marginLeft: sizing.spacing("small")
    },
    sideBySideValues: {
        flexDirection: "column",
        flex: 1,
    },
    valuesSection: {
        flexDirection: "column",
        flex: 3.5,
    },
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
